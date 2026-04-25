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
      certificates: [{
        id: String, name: String, issuer: String,
        issueDate: String, expDate: String, noExp: Boolean,
        credId: String, credUrl: String, isHidden: Boolean,
      }],
      coursework: [{
        id: String, course: String, institution: String,
        grade: String, year: String, isHidden: Boolean,
      }],
      involvement: [{
        id: String, organization: String, role: String,
        start: String, end: String, current: Boolean,
        description: String, isHidden: Boolean,
      }],
      awards: [{
        id: String, name: String, issuer: String,
        date: String, description: String, isHidden: Boolean,
      }],
      publications: [{
        id: String, title: String, publisher: String,
        date: String, url: String, description: String, isHidden: Boolean,
      }],
      references: [{
        id: String, name: String, title: String, company: String,
        email: String, phone: String, relationship: String, isHidden: Boolean,
      }],
      achievements: [{
        id: String, title: String, issuer: String,
        date: String, description: String, isHidden: Boolean,
      }],
      languages: [{
        id: String, language: String, proficiency: String, isHidden: Boolean,
      }],
      softskills: [{
        id: String, skill: String, isHidden: Boolean,
      }],
      internships: [{
        id: String, role: String, company: String, start: String, end: String,
        location: String, currentlyWorking: Boolean, description: String, isHidden: Boolean,
      }],
      freelance: [{
        id: String, role: String, client: String, start: String, end: String,
        currentlyWorking: Boolean, description: String, isHidden: Boolean,
      }],
      leadership: [{
        id: String, role: String, organization: String, start: String, end: String,
        current: Boolean, description: String, isHidden: Boolean,
      }],
      volunteering: [{
        id: String, role: String, organization: String, start: String, end: String,
        current: Boolean, description: String, isHidden: Boolean,
      }],
      hobbies: [{
        id: String, name: String, isHidden: Boolean,
      }],
      conferences: [{
        id: String, title: String, organizer: String,
        date: String, description: String, isHidden: Boolean,
      }],
      patents: [{
        id: String, title: String, issuer: String, date: String,
        url: String, description: String, isHidden: Boolean,
      }],
      extracurricular: [{
        id: String, activity: String, organization: String,
        start: String, end: String, description: String, isHidden: Boolean,
      }],
    },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;

export const User =
  (models.User as Model<User> | undefined) || model<User>('User', UserSchema);
