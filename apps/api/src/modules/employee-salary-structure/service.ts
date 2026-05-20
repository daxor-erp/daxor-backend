import { EmployeeSalaryStructureRepository } from './repository';
import { IEmployeeSalaryStructure } from './model';

export class EmployeeSalaryStructureService {
  private repository: EmployeeSalaryStructureRepository;

  constructor() {
    this.repository = new EmployeeSalaryStructureRepository();
  }

  async create(data: Partial<IEmployeeSalaryStructure>, userId: string) {
    return this.repository.create({ ...data, createdBy: userId } as IEmployeeSalaryStructure);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async getActiveForEmployee(employeeId: string, asOf?: Date) {
    return this.repository.findActiveForEmployee(employeeId, asOf);
  }

  async update(id: string, data: Partial<IEmployeeSalaryStructure>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
