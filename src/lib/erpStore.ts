import { FixedAsset, EnterpriseProject } from '@/types';

export const INITIAL_FIXED_ASSETS: FixedAsset[] = [];

export const INITIAL_ENTERPRISE_PROJECTS: EnterpriseProject[] = [];

let assetsStore: FixedAsset[] = [...INITIAL_FIXED_ASSETS];
let projectsStore: EnterpriseProject[] = [...INITIAL_ENTERPRISE_PROJECTS];

export function getFixedAssets(): FixedAsset[] {
  return assetsStore;
}

export function addFixedAsset(asset: FixedAsset): FixedAsset[] {
  assetsStore = [asset, ...assetsStore];
  return assetsStore;
}

export function updateFixedAsset(updated: FixedAsset): FixedAsset[] {
  assetsStore = assetsStore.map(a => a.id === updated.id ? updated : a);
  return assetsStore;
}

export function deleteFixedAsset(id: string): FixedAsset[] {
  assetsStore = assetsStore.filter(a => a.id !== id);
  return assetsStore;
}

export function getEnterpriseProjects(): EnterpriseProject[] {
  return projectsStore;
}

export function addEnterpriseProject(project: EnterpriseProject): EnterpriseProject[] {
  projectsStore = [project, ...projectsStore];
  return projectsStore;
}

export function updateEnterpriseProject(updated: EnterpriseProject): EnterpriseProject[] {
  projectsStore = projectsStore.map(p => p.id === updated.id ? updated : p);
  return projectsStore;
}

export function deleteEnterpriseProject(id: string): EnterpriseProject[] {
  projectsStore = projectsStore.filter(p => p.id !== id);
  return projectsStore;
}
