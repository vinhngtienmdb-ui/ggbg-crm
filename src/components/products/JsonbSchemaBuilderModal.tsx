'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Tag, Code, Copy, Check, Save, Plus, Trash2 } from 'lucide-react';
import { ProductPackage } from '@/types';
import { DYNAMIC_ATTRIBUTE_PRESETS, ECOM_PLATFORM_OPTIONS } from '@/lib/productStore';
interface JsonbSchemaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductPackage[];
  onSaveAttributes: (productId: string, updatedAttributes: Record<string, any>) => void;
  initialProductId?: string;
}

export default function JsonbSchemaBuilderModal({
  isOpen,
  onClose,
  products,
  onSaveAttributes,
  initialProductId,
}: JsonbSchemaBuilderModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || (products[0]?.id || ''));
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(true);

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [initialProductId, products, isOpen]);

  useEffect(() => {
    const selectedPkg = products.find(p => p.id === selectedProductId);
    if (selectedPkg) {
      setAttributes({ ...(selectedPkg.attributes || {}) });
    }
  }, [selectedProductId, products, isOpen]);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId);

  const handleAddAttribute = () => {
    if (!newKey.trim()) return;
    setAttributes(prev => ({ ...prev, [newKey.trim()]: newValue.trim() }));
    setNewKey('');
    setNewValue('');
  };

  const handleRemoveAttribute = (key: string) => {
    setAttributes(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleUpdateValue = (key: string, val: string) => {
    setAttributes(prev => ({ ...prev, [key]: val }));
  };

  const handleApplyPreset = (presetName: string) => {
    const presetData = DYNAMIC_ATTRIBUTE_PRESETS[presetName];
    if (presetData) {
      setAttributes(prev => ({ ...prev, ...presetData }));
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(attributes, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (selectedProductId) {
      onSaveAttributes(selectedProductId, attributes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-line shadow-cardLg w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-brand-50 text-brand-800 p-5 flex items-center justify-between border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-aqua-fg flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Trình Cấu Hình Thuộc Tính Động Dynamic JSONB Schema Builder
              </h2>
              <p className="text-xs text-ink-400">
                Tùy biến key-value attributes cho gói dịch vụ Shopee, TikTok Shop, Lazada & Amazon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-line-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-surface-subtle">
          {/* Target Package Selector */}
          <div className="bg-white p-4 rounded-xl border border-line shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">Chọn Gói Dịch Vụ Cần Cấu Hình *</label>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="px-3 py-2 bg-surface-subtle border border-line rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600 min-w-[280px]"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.sku_code}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            {currentProduct && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-500 font-medium">Nền tảng:</span>
                {currentProduct.platforms?.map(plat => {
                  const platObj = ECOM_PLATFORM_OPTIONS.find(o => o.id === plat);
                  return (
                    <span key={plat} className={`px-2.5 py-1 rounded text-[10px] font-bold border ${platObj?.color || 'bg-line-soft text-ink-700'}`}>
                      {platObj?.name || plat}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preset Selection Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-line shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-warn-fg" /> Tải Mẫu Preset Thuộc Tính TMĐT Đã Định Nghĩa Sẵn:
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.keys(DYNAMIC_ATTRIBUTE_PRESETS).map(presetName => (
                <button
                  key={presetName}
                  type="button"
                  onClick={() => handleApplyPreset(presetName)}
                  className="px-3 py-1.5 bg-line-soft hover:bg-brand-50 hover:text-brand-800 border border-line rounded-xl text-xs font-semibold transition-all"
                >
                  + {presetName}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Key-Value Editor & JSON Code Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key-Value Editor */}
            <div className="bg-white p-5 rounded-xl border border-line shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <h4 className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-brand-600" /> Danh Sách Attributes ({Object.keys(attributes).length})
                </h4>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {Object.keys(attributes).length === 0 ? (
                  <p className="text-xs text-ink-400 italic text-center py-6">
                    Chưa có thuộc tính động nào. Thêm bên dưới hoặc áp dụng Preset.
                  </p>
                ) : (
                  Object.entries(attributes).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2 bg-surface-subtle p-2 rounded-xl border border-line">
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="w-2/5 px-2.5 py-1 bg-line-soft border border-line rounded-lg text-xs font-bold text-ink-900 truncate"
                      />
                      <span className="text-ink-400 font-bold">:</span>
                      <input
                        type="text"
                        value={String(val)}
                        onChange={e => handleUpdateValue(key, e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-line rounded-lg text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(key)}
                        className="p-1.5 text-ink-400 hover:text-danger-fg hover:bg-danger-bg rounded-lg transition-colors"
                        title="Xóa thuộc tính"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Key-Value Inputs */}
              <div className="pt-3 border-t border-line space-y-2">
                <p className="text-[11px] font-bold text-ink-500">Thêm thuộc tính mới thủ công:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKey}
                    onChange={e => setNewKey(e.target.value)}
                    placeholder="Tên thuộc tính (VD: Cam kết GMV)"
                    className="w-1/2 px-3 py-1.5 bg-surface-subtle border border-line rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                  <input
                    type="text"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    placeholder="Giá trị (VD: 30%)"
                    className="w-1/2 px-3 py-1.5 bg-surface-subtle border border-line rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold whitespace-nowrap transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RAW JSON Schema Viewer */}
            <div className="bg-white text-ink-400 p-5 rounded-xl border border-line shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-aqua-fg" />
                    <h4 className="text-xs font-bold text-white">PostgreSQL JSONB Field Preview</h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-2.5 py-1 bg-surface-subtle hover:bg-line-soft text-ink-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-success-dot" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã Copy' : 'Copy JSON'}
                  </button>
                </div>

                <div className="mt-4 bg-surface-subtle p-4 rounded-xl font-mono text-xs text-success-dot overflow-x-auto border border-line max-h-80">
                  <pre>{JSON.stringify(attributes, null, 2)}</pre>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line text-[11px] text-ink-400 flex items-center justify-between">
                <span>Database column: <code className="text-aqua-fg">products.attributes (JSONB)</code></span>
                <span className="text-success-dot font-bold">✓ Valid JSON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white p-4 border-t border-line flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 rounded-xl text-xs font-bold transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Lưu Thuộc Tính JSONB
          </button>
        </div>
      </div>
    </div>
  );
}
