import { Types } from "mongoose";

export interface Member {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  joinedAt: Date;
}

interface Task {
  _id: Types.ObjectId
  text: string;
  completed: boolean;
}

interface Team {
  _id: Types.ObjectId;
  leader: Types.ObjectId;
  maxteamsize: number;
  currentteamsize: number;
  Members: Member[];
  teamname: string;
  description?: string;
  avatar: string;
  tags: string[];
  tasks: Task[];
  challengescompleted?: string;
  pendingInvites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default Team;
