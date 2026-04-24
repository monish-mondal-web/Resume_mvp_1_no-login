import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { OnboardingSchema } from '@/lib/validations';
import { rateLimit, getIP, createRateLimitResponse } from '@/lib/security/limiter';

export async function POST(req: Request) {
  try {
    // ── Rate Limiting ──
    const ip = getIP(req);
    const limit = rateLimit(ip, 'user:complete-profile', { limit: 20, windowMs: 10 * 60 * 1000 }); // 20 per 10 mins
    if (!limit.success) return createRateLimitResponse(limit.resetAt);

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // ── Validation ──
    const validation = OnboardingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        message: 'Invalid data format', 
        errors: validation.error.format() 
      }, { status: 400 });
    }

    const { personalInfo, onboardingData } = validation.data;

    await dbConnect();

    // Security check: Only update the authenticated user's record
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        $set: { 
          isProfileCompleted: true,
          name: `${personalInfo.firstName} ${personalInfo.lastName}`,
          professionalTitle: personalInfo.professionalTitle,
          phone: personalInfo.phone,
          location: personalInfo.location,
          website: personalInfo.website,
          linkedIn: personalInfo.linkedIn,
          image: personalInfo.image,
          onboardingData: onboardingData
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Profile completed and saved successfully', 
      isProfileCompleted: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    return NextResponse.json({ message: 'Internal server error while saving profile' }, { status: 500 });
  }
}
