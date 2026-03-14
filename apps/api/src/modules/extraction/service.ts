import { BaseService } from '../base/service';
import { ExtractionRepository, RawMaterialRequisitionRepository } from './repository';
import { IExtraction, IRawMaterialRequisition } from './model';

export class ExtractionService extends BaseService<IExtraction> {
  constructor(repository: ExtractionRepository) {
    super(repository);
  }
}

export class RawMaterialRequisitionService extends BaseService<IRawMaterialRequisition> {
  constructor(repository: RawMaterialRequisitionRepository) {
    super(repository);
  }
}
