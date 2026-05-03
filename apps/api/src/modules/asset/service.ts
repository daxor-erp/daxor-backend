import { BaseService } from '../base/service';
import { AppError } from '../../lib/errors/AppError';
import { ERROR_CODES } from '../../lib/errors/errorCodes';
import { AssetRepository } from './repository';
import { IAsset } from './model';

export class AssetService extends BaseService<IAsset> {
  constructor(repository: AssetRepository) {
    super(repository);
  }

  async findByIdOrNull(id: string): Promise<IAsset | null> {
    return this.repository.findById(id);
  }

  async findByOrg(
    organizationId: string,
    page: number,
    limit: number,
    status?: string,
    assetType?: string,
  ): Promise<IAsset[]> {
    const filter: Record<string, unknown> = {
      organizationId,
      isDeleted: { $ne: true },
    };
    if (status != null && String(status).trim() !== '') {
      filter.status = String(status).trim();
    }
    if (assetType != null && String(assetType).trim() !== '') {
      filter.assetType = String(assetType).trim();
    }
    const result = await this.repository.findPaginated(
      filter as any,
      page,
      limit,
      { createdAt: -1 },
    );
    return result.data;
  }

  /** Soft-delete using model field `isDeleted` (not BaseService `deletedAt`). */
  async remove(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Resource not found', 404, ERROR_CODES.NOT_FOUND);
    }
    const updated = await this.repository.update(id, { isDeleted: true } as any);
    if (!updated) {
      throw new AppError('Failed to delete resource', 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}
