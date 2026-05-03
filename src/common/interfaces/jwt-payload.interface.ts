import { Types } from 'mongoose';
export interface JwtPayload {
  sub: Types.ObjectId;
  company_id: Types.ObjectId;
  role: string;
}
