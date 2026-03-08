import { MongoBaseRepository } from '../base/mongo-repository';
import { AuditLog } from './model';

export class AuditLogRepository extends MongoBaseRepository<any> {
  constructor() {
    super(AuditLog);
  }

  async findByUserId(userId: string): Promise<any[]> {
    return this.findAllActive({ userId });
  }

  async findByEntityType(entityType: string): Promise<any[]> {
    return this.findAllActive({ entityType });
  }

  async findByAction(action: string): Promise<any[]> {
    return this.findAllActive({ action });
  }
}