import { OfficialDocument, DocumentLedgerConfig } from '@/types';

export const INITIAL_DOCUMENTS: OfficialDocument[] = [];

export const INITIAL_LEDGERS: DocumentLedgerConfig[] = [
  {
    id: 'ledger_inbound_2026',
    ledger_name: 'Sổ Công Văn Đến Năm 2026',
    ledger_type: 'INBOUND',
    prefix: 'CV-BCT',
    suffix: '/2026',
    current_number: 142,
    number_padding: 3,
    reset_frequency: 'YEARLY',
    retention_period: '10_YEARS',
    allowed_categories: ['INBOUND'],
    is_active: true,
    created_at: '2026-01-01',
  },
  {
    id: 'ledger_outbound_2026',
    ledger_name: 'Sổ Công Văn Đi Doanh Nghiệp',
    ledger_type: 'OUTBOUND',
    prefix: 'CV-GGBG',
    suffix: '/GGBG',
    current_number: 315,
    number_padding: 3,
    reset_frequency: 'YEARLY',
    retention_period: '10_YEARS',
    allowed_categories: ['OUTBOUND'],
    is_active: true,
    created_at: '2026-01-01',
  },
  {
    id: 'ledger_internal_decisions',
    ledger_name: 'Sổ Quyết Định & Tờ Trình Ban Giám Đốc',
    ledger_type: 'INTERNAL',
    prefix: 'QĐ-GGBG',
    suffix: '/QĐ-2026',
    current_number: 88,
    number_padding: 3,
    reset_frequency: 'YEARLY',
    retention_period: 'PERMANENT',
    allowed_categories: ['DECISION', 'SUBMISSION_STATEMENT', 'ANNOUNCEMENT'],
    is_active: true,
    created_at: '2026-01-01',
  },
  {
    id: 'ledger_internal_sop',
    ledger_name: 'Sổ Quy Chế SOP & Biên Bản HĐQT',
    ledger_type: 'INTERNAL',
    prefix: 'QC-GGBG',
    suffix: '/SOP',
    current_number: 15,
    number_padding: 3,
    reset_frequency: 'NEVER',
    retention_period: 'PERMANENT',
    allowed_categories: ['INTERNAL_SOP', 'CONTRACT_MINUTES', 'PERIODIC_REPORT'],
    is_active: true,
    created_at: '2026-01-01',
  },
];

let docStore: OfficialDocument[] = [...INITIAL_DOCUMENTS];
let ledgerStore: DocumentLedgerConfig[] = [...INITIAL_LEDGERS];

export function getOfficialDocuments(): OfficialDocument[] {
  return docStore;
}

export function addOfficialDocument(doc: OfficialDocument): OfficialDocument[] {
  docStore = [doc, ...docStore];
  return docStore;
}

export function updateOfficialDocument(updated: OfficialDocument): OfficialDocument[] {
  docStore = docStore.map(d => d.id === updated.id ? updated : d);
  return docStore;
}

export function deleteOfficialDocument(id: string): OfficialDocument[] {
  docStore = docStore.filter(d => d.id !== id);
  return docStore;
}

export function getDocumentLedgers(): DocumentLedgerConfig[] {
  return ledgerStore;
}

export function addDocumentLedger(ledger: DocumentLedgerConfig): DocumentLedgerConfig[] {
  ledgerStore = [ledger, ...ledgerStore];
  return ledgerStore;
}

export function updateDocumentLedger(updated: DocumentLedgerConfig): DocumentLedgerConfig[] {
  ledgerStore = ledgerStore.map(l => l.id === updated.id ? updated : l);
  return ledgerStore;
}

export function deleteDocumentLedger(id: string): DocumentLedgerConfig[] {
  ledgerStore = ledgerStore.filter(l => l.id !== id);
  return ledgerStore;
}
