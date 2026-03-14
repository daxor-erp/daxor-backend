import { MongoBaseRepository } from '../base/mongo-repository';
import { Extraction, RawMaterialRequisition, IExtraction, IRawMaterialRequisition } from './model';

export class ExtractionRepository extends MongoBaseRepository<IExtraction> {
  constructor() {
    super(Extraction);
  }
}

export class RawMaterialRequisitionRepository extends MongoBaseRepository<IRawMaterialRequisition> {
  constructor() {
    super(RawMaterialRequisition);
  }
}
