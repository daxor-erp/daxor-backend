import { Schema, model } from 'mongoose';

const sequenceSchema = new Schema({
  _id: String,
  seq: {
    type: Number,
    default: 0,
  },
});

export const Sequence = model('Sequence', sequenceSchema);

export async function getNextSequenceNumber(collectionName: string): Promise<number> {
  const result = await Sequence.findByIdAndUpdate(
    collectionName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
}

export function generateSeqNo(prefix: string, seqNumber: number): string {
  return `${prefix}-${String(seqNumber).padStart(4, '0')}`;
}
