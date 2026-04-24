import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    otpResendCount: {
      type: Number,
      default: 0,
    },
    otpNextResend: {
      type: Date,
    },
    resetOTP: {
      type: String,
    },
    resetOTPExpiry: {
      type: Date,
    },
    otpFailures: {
      type: Number,
      default: 0,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    professionalTitle: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    // Comprehensive onboarding data
    onboardingData: {
      experience: [{
        id: String,
        role: String,
        company: String,
        location: String,
        start: String,
        end: String,
        currentlyWorking: Boolean,
        description: String,
        isHidden: Boolean,
      }],
      education: [{
        id: String,
        type: { type: String, enum: ['school', 'college'] },
        school: String,
        degree: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        gpa: String,
        isHidden: Boolean,
      }],
      skills: [String],
      projects: [{
        id: String,
        title: String,
        description: String,
        url: String,
        start: String,
        end: String,
        ongoing: Boolean,
        tech: String,
        isHidden: Boolean,
      }],
      // Other flexible sections
      certificates: [Schema.Types.Mixed],
      coursework: [Schema.Types.Mixed],
      involvement: [Schema.Types.Mixed],
      awards: [Schema.Types.Mixed],
      publications: [Schema.Types.Mixed],
      references: [Schema.Types.Mixed],
      achievements: [Schema.Types.Mixed],
      languages: [Schema.Types.Mixed],
      softskills: [Schema.Types.Mixed],
      internships: [Schema.Types.Mixed],
      freelance: [Schema.Types.Mixed],
      leadership: [Schema.Types.Mixed],
      volunteering: [Schema.Types.Mixed],
      hobbies: [Schema.Types.Mixed],
      conferences: [Schema.Types.Mixed],
      patents: [Schema.Types.Mixed],
      extracurricular: [Schema.Types.Mixed],
    },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;

export const User =
  (models.User as Model<User> | undefined) || model<User>('User', UserSchema);
