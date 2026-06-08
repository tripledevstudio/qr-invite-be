export enum RequestType {
  REGISTER = 'REGISTER',
  WITHDRAW = 'WITHDRAW',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Request entity representing actions that require admin/store approval.
 * - REGISTER: New user registration verification.
 * - WITHDRAW: User requests to withdraw points from a store.
 */
export class Request {
  id?: string;
  user_id: string;
  store_id?: string; // optional, used for withdraw requests
  type: RequestType;
  amount?: number; // amount to withdraw, applicable for WITHDRAW
  status: RequestStatus;
  created_at?: Date;
  updated_at?: Date;

  constructor(partial: Partial<Request>) {
    Object.assign(this, partial);
  }
}