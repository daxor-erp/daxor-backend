import { MongoBaseRepository } from '../base/mongo-repository';
import { Attendance } from './model';

export class AttendanceRepository extends MongoBaseRepository<any> {
  constructor() {
    super(Attendance);
  }

  async findByUserId(userId: string): Promise<any[]> {
    return this.findAllActive({ userId });
  }

  async findByStatus(status: string): Promise<any[]> {
    return this.findAllActive({ status });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.findAllActive({
      $and: [
        { attendanceDate: { $gte: startDate } },
        { attendanceDate: { $lte: endDate } }
      ]
    });
  }
}