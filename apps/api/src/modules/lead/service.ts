import { LeadRepository } from './repository';
import { ILead } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class LeadService {
  private repository: LeadRepository;

  constructor() {
    this.repository = new LeadRepository();
  }

  async create(data: Partial<ILead>, userId: string) {
    try {
      const seq = await getNextSequence({ type: 'Lead', organizationId: data.organizationId! });
      const seqNo = formatEntitySequence('LEAD', data.organizationId!.toString(), seq);
      
      // Clean up empty string fields that should be undefined
      const cleanData = { ...data };
      if (cleanData.assignedTo === '') delete cleanData.assignedTo;
      if (cleanData.email === '') delete cleanData.email;
      if (cleanData.phone === '') delete cleanData.phone;
      if (cleanData.company === '') delete cleanData.company;
      if (cleanData.title === '') delete cleanData.title;
      if (cleanData.source === '') delete cleanData.source;
      if (cleanData.notes === '') delete cleanData.notes;
      if (cleanData.expectedCloseDate === '') delete cleanData.expectedCloseDate;
      
      const result = await this.repository.create({ ...cleanData, seqNo, createdBy: userId } as ILead);
      console.log('Lead created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in LeadService.create:', error);
      throw error;
    }
  }

  async getAll(organizationId: string, status?: string) {
    return this.repository.findByOrganization(organizationId, status);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<ILead>) {
    // Clean up empty string fields that should be undefined
    const cleanData = { ...data };
    if (cleanData.assignedTo === '') delete cleanData.assignedTo;
    if (cleanData.email === '') delete cleanData.email;
    if (cleanData.phone === '') delete cleanData.phone;
    if (cleanData.company === '') delete cleanData.company;
    if (cleanData.title === '') delete cleanData.title;
    if (cleanData.source === '') delete cleanData.source;
    if (cleanData.notes === '') delete cleanData.notes;
    if (cleanData.expectedCloseDate === '') delete cleanData.expectedCloseDate;
    
    return this.repository.update(id, cleanData);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  async convertToOpportunity(id: string) {
    const lead = await this.repository.findById(id);
    if (!lead) throw new Error('Lead not found');
    if (lead.status === 'pending_approval') {
      throw new Error('Approve or decline this lead before converting');
    }

    await this.repository.update(id, { status: 'converted' } as any);
    return lead;
  }

  async submitForApproval(id: string): Promise<any> {
    const lead = await this.repository.findById(id)
    if (!lead || lead.isDeleted) throw new Error('Lead not found')
    const st = String(lead.status)
    if (!['new', 'contacted', 'qualified', 'approval_rejected'].includes(st)) {
      throw new Error('This lead cannot be submitted for approval in its current state')
    }
    return this.repository.update(id, { status: 'pending_approval' } as any)
  }

  async approveFromQueue(id: string): Promise<any> {
    const lead = await this.repository.findById(id)
    if (!lead) throw new Error('Lead not found')
    if (String(lead.status) !== 'pending_approval') {
      throw new Error('Only leads pending approval can be approved')
    }
    return this.repository.update(id, { status: 'qualified' } as any)
  }

  async rejectFromQueue(id: string): Promise<any> {
    const lead = await this.repository.findById(id)
    if (!lead) throw new Error('Lead not found')
    if (String(lead.status) !== 'pending_approval') {
      throw new Error('Only leads pending approval can be declined')
    }
    return this.repository.update(id, { status: 'approval_rejected' } as any)
  }
}
