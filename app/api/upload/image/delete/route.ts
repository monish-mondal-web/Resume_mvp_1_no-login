import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/utils/env';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ message: 'Public ID is required' }, { status: 400 });
    }

    // Security check: Ensure the publicId belongs to the user's isolated folder
    const userId = session.user.id;
    const userFolderPrefix = `freshresume/profiles/${userId}/`;
    
    if (!publicId.startsWith(userFolderPrefix)) {
      return NextResponse.json({ message: 'Forbidden: You can only delete your own images' }, { status: 403 });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Failed to delete image from Cloudinary', details: result }, { status: 500 });
    }
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
