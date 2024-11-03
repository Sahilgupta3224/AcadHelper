import { Types } from "mongoose";

interface Notification {
  _id: Types.ObjectId; // Unique identifier for the Notification
  name: string; // Name of the Notification
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notification:any; 
  createdAt: Date; 
  updatedAt: Date;
}

export default Notification;
