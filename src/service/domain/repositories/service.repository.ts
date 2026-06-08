export const SERVICE_REPOSITORY_TOKEN = 'SERVICE_REPOSITORY';

export interface ServiceRepository {
  create(entity: any): Promise<any>;
  findAll(): Promise<any[]>;
  findOne(id: string): Promise<any>;
  update(id: string, entity: any): Promise<any>;
  remove(id: string): Promise<{ deleted: boolean }>;
}
