'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Loader2,
  UserRound,
  Users,
  UserCheck,
  Package,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';

type SearchResultType = 'customer' | 'lead' | 'employee' | 'product';

interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GROUP_META: Record<SearchResultType, { label: string; icon: React.ReactNode; badge: string }> = {
  customer: {
    label: 'Khách Hàng',
    icon: <Users className="w-4 h-4" />,
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  lead: {
    label: 'Lead',
    icon: <UserCheck className="w-4 h-4" />,
    badge: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  employee: {
    label: 'Nhân Sự',
    icon: <UserRound className="w-4 h-4" />,
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  product: {
    label: 'Sản Phẩm / Gói Dịch Vụ',
    icon: <Package className="w-4 h-4" />,
    badge: 'bg-purple-50 text-purple-600 border-purple-100',
  },
};

const GROUP_ORDER: SearchResultType[] = ['customer', 'lead', 'employee', 'product'];

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset khi mở
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Debounce fetch
  useEffect(() => {
    if (!isOpen) return;
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setActiveIndex(0);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, isOpen]);

  const navigateTo = useCallback(
    (r: SearchResult) => {
      onClose();
      router.push(r.href);
    },
    [onClose, router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) navigateTo(r);
    }
  };

  // Cuộn item đang chọn vào tầm nhìn
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  // Nhóm kết quả giữ thứ tự index toàn cục để điều hướng phím
  let runningIndex = -1;
  const grouped = GROUP_ORDER.map((type) => ({
    type,
    items: results.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0);

  const term = query.trim();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/40 backdrop-blur-sm px-4 pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={onKeyDown}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm khách hàng, lead, nhân sự, sản phẩm..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Kết quả */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
          {term.length < 2 ? (
            <div className="px-4 py-10 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">Nhập từ khoá để tìm kiếm</p>
              <p className="text-xs text-slate-400 mt-1">
                Tìm nhanh trên toàn hệ thống: khách hàng, lead, nhân sự, gói dịch vụ.
              </p>
            </div>
          ) : !loading && results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold text-slate-500">Không tìm thấy kết quả</p>
              <p className="text-xs text-slate-400 mt-1">
                Không có mục nào khớp với "<span className="font-semibold text-slate-600">{term}</span>".
              </p>
            </div>
          ) : (
            grouped.map((group) => {
              const meta = GROUP_META[group.type];
              return (
                <div key={group.type} className="mb-1">
                  <div className="px-4 pt-2 pb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {meta.label}
                  </div>
                  {group.items.map((r) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={`${r.type}-${r.id}`}
                        data-idx={idx}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => navigateTo(r)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? 'bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${meta.badge}`}
                        >
                          {meta.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-900 truncate">{r.title}</span>
                          {r.subtitle && (
                            <span className="block text-xs text-slate-500 truncate">{r.subtitle}</span>
                          )}
                        </span>
                        {isActive && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer gợi ý phím */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 bg-slate-50 text-[10.5px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center px-1 py-0.5 rounded border border-slate-300 bg-white">
                <ArrowUp className="w-2.5 h-2.5" />
              </kbd>
              <kbd className="inline-flex items-center px-1 py-0.5 rounded border border-slate-300 bg-white">
                <ArrowDown className="w-2.5 h-2.5" />
              </kbd>
              <span>Di chuyển</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center px-1 py-0.5 rounded border border-slate-300 bg-white">
                <CornerDownLeft className="w-2.5 h-2.5" />
              </kbd>
              <span>Mở</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white font-mono">Esc</kbd>
            <span>Đóng</span>
          </span>
        </div>
      </div>
    </div>
  );
}
