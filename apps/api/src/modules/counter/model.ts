import mongoose, { Document, Schema } from 'mongoose';

interface ICounter extends Document {
  seq: number;
  scope: Record<string, string | number>;
}

const CounterSchema = new Schema<ICounter>({
  scope: { type: Map, of: String, required: true }, // Store scope fields as a Map
  seq: { type: Number, required: true, default: 1000 },
});

CounterSchema.index({ scope: 1 }, { unique: true }); // Unique combination of scope fields

const Model = mongoose.model<ICounter>('Counter', CounterSchema);

export const getNextSequence = async (
  scope: Record<string, string | number>,
): Promise<string> => {
  const counter = await Model.findOneAndUpdate(
    { scope },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return counter.seq.toString();
};

export default Model;
