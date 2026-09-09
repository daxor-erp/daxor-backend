import { JournalEntryService } from './service';

const service = new JournalEntryService();

function iso(value: unknown): string {
  if (value == null || value === '') return new Date(0).toISOString();
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  const d = new Date(value as string | number);
  return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

function isoOrNull(value: unknown): string | null {
  if (value == null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  const d = new Date(value as string | number);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function mapLine(line: any) {
  return {
    accountCode: String(line?.accountCode ?? ''),
    accountName: String(line?.accountName ?? line?.accountCode ?? 'Account'),
    debit: Number(line?.debit) || 0,
    credit: Number(line?.credit) || 0,
    description: line?.description != null ? String(line.description) : null,
  };
}

function mapJournal(doc: any) {
  const o = doc?.toObject?.() ?? doc ?? {};
  return {
    ...o,
    id: o._id?.toString?.() ?? o.id,
    organizationId: String(o.organizationId ?? ''),
    entryNumber: String(o.entryNumber ?? ''),
    description: String(o.description ?? ''),
    status: String(o.status ?? 'draft'),
    totalDebit: Number(o.totalDebit) || 0,
    totalCredit: Number(o.totalCredit) || 0,
    entryDate: iso(o.entryDate),
    postedAt: isoOrNull(o.postedAt),
    createdAt: iso(o.createdAt),
    lines: Array.isArray(o.lines) ? o.lines.map(mapLine) : [],
  };
}

export const resolvers = {
  Query: {
    journalEntry: async (_: any, { id }: { id: string }) => {
      const row = await service.getById(id);
      return row ? mapJournal(row) : null;
    },
    journalEntries: async (_: any, { organizationId, status }: any) => {
      const rows = await service.getAll(organizationId, status);
      return rows.map(mapJournal);
    },
  },
  Mutation: {
    createJournalEntry: async (_: any, { input }: any, context: any) => {
      const created = await service.create(input, context.user?.id || 'system');
      return mapJournal(created);
    },
    updateJournalEntry: async (_: any, { id, input }: any) => {
      const updated = await service.update(id, input);
      return mapJournal(updated);
    },
    postJournalEntry: async (_: any, { id }: { id: string }, context: any) => {
      const posted = await service.post(id, context.user?.id || 'system');
      return mapJournal(posted);
    },
    deleteJournalEntry: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  JournalEntry: {
    id: (j: any) => j._id?.toString?.() ?? j.id,
    entryDate: (j: any) => (typeof j.entryDate === 'string' ? j.entryDate : iso(j.entryDate)),
    postedAt: (j: any) =>
      j.postedAt == null
        ? null
        : typeof j.postedAt === 'string'
          ? j.postedAt
          : isoOrNull(j.postedAt),
    createdAt: (j: any) => (typeof j.createdAt === 'string' ? j.createdAt : iso(j.createdAt)),
    lines: (j: any) => (Array.isArray(j.lines) ? j.lines.map(mapLine) : []),
  },
  JournalEntryLine: {
    accountCode: (l: any) => String(l?.accountCode ?? ''),
    accountName: (l: any) => String(l?.accountName ?? l?.accountCode ?? 'Account'),
    debit: (l: any) => Number(l?.debit) || 0,
    credit: (l: any) => Number(l?.credit) || 0,
  },
};
