import { BaseController } from '../base/controller';
import { AssetService } from './service';
import { IAsset } from './model';
import { AssetRepository } from './repository';

const assetRepo = new AssetRepository();
const assetService = new AssetService(assetRepo);

export class AssetController extends BaseController<IAsset> {
  constructor() {
    super(assetService);
  }
}
