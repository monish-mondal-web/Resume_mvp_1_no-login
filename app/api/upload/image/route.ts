import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/utils/env';
import { v2 as cloudinary } from 'cloudinary';
import { rateLimit, getIP, createRateLimitResponse } from '@/lib/security/limiter';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // ── Rate Limiting ──
    const ip = getIP(req);
    const limit = rateLimit(ip, 'upload:image', { limit: 10, windowMs: 60 * 60 * 1000 }); // 10 per hour
    if (!limit.success) return createRateLimitResponse(limit.resetAt);

    // 1. Authentication Check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and Validate Form Data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // 3. File Security Validations
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPG, PNG and WebP are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // 4. Transform to Data URI for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 5. Cloudinary Upload with User Isolation
    // Using user id in folder path for security isolation
    const userId = session.user.id;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `freshresume/profiles/${userId}`,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' } // Optimization
      ],
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    });
  } catch (err) {
    console.error('Cloudinary secure upload error:', err);
    let msg = 'Internal server error during upload';
    if (err instanceof Error) msg = err.message;
    else if (typeof err === 'object' && err !== null && 'message' in err) {
      msg = String((err as { message: string }).message);
    }
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
