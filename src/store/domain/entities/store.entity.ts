import { ApiPropertyOptional } from '@nestjs/swagger';

export class Store {
  @ApiPropertyOptional({ description: 'Admin user ID that owns this store' })
  user_id?: string;
  id!: string;
  name!: string;
  address?: string;
  phone_number?: string;
  email?: string;
  default_commission?: number; // % hoa hồng mặc định
  extra_bonus?: number; // thưởng thêm cho đơn > 500k
  monthly_revenue?: number;
  collaborator_count?: number;
  created_at: string;
  updated_at: string;

  constructor(partial: Partial<Store>) {
    Object.assign(this, partial);
    this.created_at = partial.created_at || new Date().toISOString();
    this.updated_at = partial.updated_at || new Date().toISOString();
    if (this.default_commission === undefined) this.default_commission = 10;
    if (this.extra_bonus === undefined) this.extra_bonus = 0;
    if (this.monthly_revenue === undefined) this.monthly_revenue = 0;
    if (this.collaborator_count === undefined) this.collaborator_count = 0;
  }
}
