import mongoose, { Schema, model, models, InferSchemaType } from 'mongoose';

export type SuggestionType =
  | 'skill'
  | 'role'
  | 'company'
  | 'institute'
  | 'language'
  | 'location'
  | 'degree'
  | 'field';

const SuggestionSchema = new Schema(
  {
    value:           { type: String, required: true, trim: true, maxlength: 200 },
    normalizedValue: { type: String, required: true, lowercase: true, trim: true, maxlength: 200 },
    type:            { type: String, required: true, enum: ['skill', 'role', 'company', 'institute', 'language', 'location', 'degree', 'field'] },
    usageCount:      { type: Number, default: 0, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Unique constraint — prevents duplicates (case-insensitive via normalizedValue)
SuggestionSchema.index({ normalizedValue: 1, type: 1 }, { unique: true });

// Fast prefix / substring lookups sorted by popularity
SuggestionSchema.index({ type: 1, usageCount: -1 });

// Text index for full-text search fallback
SuggestionSchema.index({ value: 'text' });

export type SuggestionDoc = InferSchemaType<typeof SuggestionSchema>;

// Fix for Next.js HMR (Hot Module Replacement) caching the old schema
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Suggestion;
}

const Suggestion =
  (models.Suggestion as mongoose.Model<SuggestionDoc>) ||
  model<SuggestionDoc>('Suggestion', SuggestionSchema);

export default Suggestion;
