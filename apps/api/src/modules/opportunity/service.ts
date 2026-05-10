import { OpportunityRepository } from './repository';
import { IOpportunity } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class OpportunityService {
  private repository: OpportunityRepository;

  constructor() {
    this.repository = new OpportunityRepository();
  }

  async create(data: Partial<IOpportunity>, userId: string) {
    const seq = await getNextSequence({ type: 'Opportunity', organizationId: data.organizationId! });
    const seqNo = formatEntitySequence('OPP', data.organizationId!.toString(), seq);
    
    // Clean up empty string fields that should be undefined
    const cleanData = { ...data };
    if (cleanData.assignedTo === '') delete cleanData.assignedTo;
    if (cleanData.email === '') delete cleanData.email;
    if (cleanData.phone === '') delete cleanData.phone;
    if (cleanData.accountName === '') delete cleanData.accountName;
    if (cleanData.contactName === '') delete cleanData.contactName;
    if (cleanData.leadSource === '') delete cleanData.leadSource;
    if (cleanData.nextStep === '') delete cleanData.nextStep;
    if (cleanData.description === '') delete cleanData.description;
    if (!cleanData.closeDate) delete cleanData.closeDate;
    
    return this.repository.create({ ...cleanData, seqNo, createdBy: userId } as IOpportunity);
  }

  async getAll(organizationId: string, stage?: string) {
    return this.repository.findByOrganization(organizationId, stage);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IOpportunity>) {
    // Clean up empty string fields that should be undefined
    const cleanData = { ...data };
    if (cleanData.assignedTo === '') delete cleanData.assignedTo;
    if (cleanData.email === '') delete cleanData.email;
    if (cleanData.phone === '') delete cleanData.phone;
    if (cleanData.accountName === '') delete cleanData.accountName;
    if (cleanData.contactName === '') delete cleanData.contactName;
    if (cleanData.leadSource === '') delete cleanData.leadSource;
    if (cleanData.nextStep === '') delete cleanData.nextStep;
    if (cleanData.description === '') delete cleanData.description;
    if (!cleanData.closeDate) delete cleanData.closeDate;
    
    return this.repository.update(id, cleanData);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
