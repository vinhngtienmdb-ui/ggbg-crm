import bankData from '@/data/bankCatalog.json';

export interface BankItem {
  code: string;
  name: string;
  shortName: string;
  fullName: string;
}

export interface BranchItem {
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  rawBranch: string;
}

export const ALL_BANKS: BankItem[] = bankData.banks;
export const ALL_BRANCHES: BranchItem[] = bankData.branches;

// Get full bank list
export function getBanks(): BankItem[] {
  return ALL_BANKS;
}

// Find a bank by code, shortName, or exact full name
export function findBank(query: string): BankItem | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return ALL_BANKS.find(
    (b) =>
      b.code === q ||
      b.shortName.toLowerCase() === q ||
      b.name.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q)
  );
}

// Get branches for a specific bank (by bankCode or bank name)
export function getBranchesForBank(bankIdentifier?: string): BranchItem[] {
  if (!bankIdentifier) return ALL_BRANCHES.slice(0, 100);
  
  const bank = findBank(bankIdentifier);
  if (bank) {
    const matched = ALL_BRANCHES.filter(
      (br) => br.bankCode === bank.code || br.bankName.toLowerCase().includes(bank.shortName.toLowerCase())
    );
    if (matched.length > 0) return matched;
  }

  // Fallback match by bank name keyword
  const q = bankIdentifier.trim().toLowerCase();
  const matched = ALL_BRANCHES.filter(
    (br) => br.bankName.toLowerCase().includes(q) || br.rawBranch.toLowerCase().includes(q)
  );
  return matched.length > 0 ? matched : ALL_BRANCHES.slice(0, 50);
}

// Search branches with auto-filtering
export function searchBranches(keyword: string, bankIdentifier?: string): BranchItem[] {
  const branches = getBranchesForBank(bankIdentifier);
  if (!keyword) return branches;
  const q = keyword.trim().toLowerCase();
  return branches.filter(
    (br) =>
      br.branchName.toLowerCase().includes(q) ||
      br.branchCode.includes(q) ||
      br.rawBranch.toLowerCase().includes(q)
  );
}
