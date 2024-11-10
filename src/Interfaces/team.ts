import mongoose from "mongoose";

interface Member {
    memberId: mongoose.Types.ObjectId;
    joinedAt?: Date;
}

interface Team {
    _id: mongoose.Types.ObjectId;
    leader: mongoose.Types.ObjectId;
    maxteamsize?: number;
    currentteamsize?: number;
    Members: Member[];
    teamname: string;
    description?: string;
    avatar?: string;
    tags?: string[];
    challengescompleted?: string;
    pendingInvites?: any[];
}

export default Team