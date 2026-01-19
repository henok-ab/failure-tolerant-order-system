//Database table to store events
export class Outbox {
  id: string;
  eventType: string;
  payload: string;
  processed: boolean;
  createdAt: Date;
  updatedAt: Date;
}