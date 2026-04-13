// Shared types for the Weight Tracker application

export interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
  notes?: string;
}
