import { BaseController } from '../base/controller';
import { ExtractionService } from './service';
import { IExtraction } from './model';
import { ExtractionRepository } from './repository';

const extractionRepo = new ExtractionRepository();
const extractionService = new ExtractionService(extractionRepo);

export class ExtractionController extends BaseController<IExtraction> {
  constructor() {
    super(extractionService);
  }
}
