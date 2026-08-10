import { KPIAssignment, KpiAssigneeType, KpiCategory, KpiMetricType } from '@/types';

export const KPI_UPDATED_EVENT = 'ggbg_kpi_updated_event';

export const INITIAL_KPIS: KPIAssignment[] = [];

const STORAGE_KEY = 'ggbg_kpi_assignments_v2';

function loadKPIs(): KPIAssignment[] {
  if (typeof window === 'undefined') return INITIAL_KPIS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_KPIS));
      return INITIAL_KPIS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading KPIs from localStorage:', e);
    return INITIAL_KPIS;
  }
}

function saveKPIs(data: KPIAssignment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(KPI_UPDATED_EVENT));
  } catch (e) {
    console.error('Error saving KPIs to localStorage:', e);
  }
}

export function calculateProgressPercentage(target: number, actual: number): number {
  if (target <= 0) return 0;
  const pct = (actual / target) * 100;
  return Math.round(pct * 10) / 10;
}

export function getKPIs(): KPIAssignment[] {
  return loadKPIs();
}

export function getKPIById(id: string): KPIAssignment | undefined {
  const list = loadKPIs();
  return list.find((k) => k.id === id);
}

export function createKPI(newItem: Omit<KPIAssignment, 'id' | 'progress_percentage' | 'created_at'>): KPIAssignment {
  const currentList = loadKPIs();
  const target = Number(newItem.target_value) || 0;
  const actual = Number(newItem.actual_value) || 0;
  const progress_percentage = calculateProgressPercentage(target, actual);

  const created: KPIAssignment = {
    ...newItem,
    target_value: target,
    actual_value: actual,
    progress_percentage,
    id: `kpi_${Date.now()}`,
    kpi_code: newItem.kpi_code || `KPI-${newItem.assignee_type.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString().split('T')[0],
  };

  const updatedList = [created, ...currentList];
  saveKPIs(updatedList);
  return created;
}

export function updateKPI(id: string, updates: Partial<KPIAssignment>): KPIAssignment {
  const currentList = loadKPIs();
  let updatedObj: KPIAssignment | undefined;

  const updatedList = currentList.map((k) => {
    if (k.id === id) {
      const target = updates.target_value !== undefined ? Number(updates.target_value) : k.target_value;
      const actual = updates.actual_value !== undefined ? Number(updates.actual_value) : k.actual_value;
      const progress_percentage = calculateProgressPercentage(target, actual);
      updatedObj = {
        ...k,
        ...updates,
        target_value: target,
        actual_value: actual,
        progress_percentage,
      };
      return updatedObj;
    }
    return k;
  });

  if (!updatedObj) throw new Error('KPI item not found');
  saveKPIs(updatedList);
  return updatedObj;
}

export function deleteKPI(id: string): void {
  const currentList = loadKPIs();
  const updatedList = currentList.filter((k) => k.id !== id);
  saveKPIs(updatedList);
}
