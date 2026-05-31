export const CHECK_IN_REPOSITORY_TOKEN = 'CHECK_IN_REPOSITORY';

export interface CheckInRepository {
  checkIn(dto: any): Promise<any>;
  findOne(id: string): Promise<any>;
  getLogs(filter: any): Promise<any[]>;
  update(id: string, dto: any): Promise<any>;
  remove(id: string): Promise<{ deleted: boolean }>;
}