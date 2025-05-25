import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IWeight extends Document {
  weight: number;
  date: Date;
  notes?: string;
}

const WeightSchema: Schema = new Schema(
  {
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight cannot exceed 500 kg'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export default models.Weight || model<IWeight>('Weight', WeightSchema); 