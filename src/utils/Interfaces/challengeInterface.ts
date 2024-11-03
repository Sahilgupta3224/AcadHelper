

interface Challenge {
  _id: string; // Unique identifier for the challenge
  title: string; // Title of the challenge
  description: string; // Description of the challenge
  type: 'individual' | 'team'; // Type of challenge (individual or team)
  frequency: 'daily' | 'weekly' | 'custom'; // Frequency of the challenge
  startDate: string; // Start date of the challenge
  endDate: string; // End date of the challenge
  points: string; // Points awarded for participation/completion
  participants:string[]; // Array of participant IDs
  createdBy:string; // ID of the user who created the challenge
  createdAt: string; // Timestamp for when the challenge was created
  updatedAt: string; // Timestamp for when the challenge was last updated
}

export default Challenge;
