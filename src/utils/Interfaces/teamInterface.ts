import { Types } from "mongoose";

interface Member {
  memberId: Types.ObjectId; // Unique identifier for the member
  joinedAt: Date; // Date the member joined the team
}

interface Team {
  _id: Types.ObjectId; // Unique identifier for the team
  leader: Types.ObjectId; // ID of the user who is the leader of the team
  maxTeamSize: number; // Maximum number of members allowed in the team
  currentTeamSize: number; // Current number of members in the team
  members: Member[]; // Array of members in the team
  teamName: string; // Required name of the team
  description?: string; // Optional description of the team
  avatar?: string; // Optional avatar image URL for the team
  tags: string[]; // Tags associated with the team
  challengesCompleted?: string; // Optional field for tracking completed challenges
  pendingInvites?: Types.ObjectId[]; // Array of pending invites to join the team
  createdAt: Date; // Timestamp for when the team was created
  updatedAt: Date; // Timestamp for when the team was last updated
}

export default Team;
