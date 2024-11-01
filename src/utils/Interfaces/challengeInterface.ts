import { Types } from "mongoose";

interface Challenge {
  _id: Types.ObjectId; // Unique identifier for the challenge
  title: string; // Title of the challenge
  description: string; // Description of the challenge
  type: 'individual' | 'team'; // Type of challenge (individual or team)
  frequency: 'daily' | 'weekly' | 'custom'; // Frequency of the challenge
  startDate: Date; // Start date of the challenge
  endDate: Date; // End date of the challenge
  points: number; // Points awarded for participation/completion
  participants: Types.ObjectId[]; // Array of participant IDs
  createdBy: Types.ObjectId; // ID of the user who created the challenge
  createdAt: Date; // Timestamp for when the challenge was created
  updatedAt: Date; // Timestamp for when the challenge was last updated
}

export default Challenge;
