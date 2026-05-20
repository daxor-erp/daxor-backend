import { OnboardingRepository } from './repository';
import { IOnboarding } from './model';

export class OnboardingService {
  private repo = new OnboardingRepository();

  async create(data: Partial<IOnboarding>, userId: string) {
    return this.repo.create({ ...data, createdBy: userId } as IOnboarding);
  }
  async getAll(organizationId: string) { return this.repo.findByOrganization(organizationId); }
  async getById(id: string) { return this.repo.findById(id); }
  async getByEmployee(employeeId: string) { return this.repo.findByEmployee(employeeId); }
  async update(id: string, data: Partial<IOnboarding>) { return this.repo.update(id, data); }
  async toggleTask(id: string, index: number, done: boolean) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new Error('Onboarding not found');
    if (!doc.tasks[index]) throw new Error('Task not found');
    doc.tasks[index].done = done;
    doc.tasks[index].doneAt = done ? new Date() : undefined;
    if (doc.tasks.every((t) => t.done)) {
      doc.status = 'COMPLETED';
      doc.completedAt = new Date();
    } else if (doc.status === 'COMPLETED') {
      doc.status = 'IN_PROGRESS';
      doc.completedAt = undefined;
    }
    await doc.save();
    return doc;
  }
  async delete(id: string) { return this.repo.softDelete(id); }
}
