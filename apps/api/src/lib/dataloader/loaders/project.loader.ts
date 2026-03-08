/**
 * Project DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { ProjectRepository } from '../../../modules/project/repository';
import type { Project } from '../../../modules/project/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadProjects(projectIds: readonly string[]): Promise<(Project | Error)[]> {
  const repository = getRepository(ProjectRepository);
  
  try {
    const projects = await repository.findByIds(Array.from(projectIds));
    const projectMap = new Map<string, Project>();
    projects.forEach(project => projectMap.set(project.id, project));
    
    return projectIds.map(id => {
      const project = projectMap.get(id);
      return project || new Error(`Project not found: ${id}`);
    });
  } catch (error) {
    return projectIds.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createProjectLoader() {
  return createDataLoader<string, Project>({
    batchLoadFn: batchLoadProjects,
    cacheKeyFn: (project) => project.id,
    maxBatchSize: 100,
    cache: true,
  });
}
