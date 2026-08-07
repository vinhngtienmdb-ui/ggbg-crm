'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Tag, Code, Copy, Check, Save, Plus, Trash2, Sliders } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-white text-slate-900 p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Trình Cấu Hình Thuộc Tính Động Dynamic JSONB Schema Builder
              </h2>
              <p className="text-xs text-slate-500">
                Tùy biến key-value attributes cho gói dịch vụ Shopee, TikTok Shop, Lazada & Amazon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
          {/* Target Package Selector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Gói Dịch Vụ Cần Cấu Hình *</label>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[280px]"
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
                <span className="text-xs text-slate-500 font-medium">Nền tảng:</span>
                {currentProduct.platforms?.map(plat => {
                  const platObj = ECOM_PLATFORM_OPTIONS.find(o => o.id === plat);
                  return (
                    <span key={plat} className={`px-2.5 py-1 rounded text-[10px] font-bold border ${platObj?.color || 'bg-slate-100 text-slate-700'}`}>
                      {platObj?.name || plat}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preset Selection Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Tải Mẫu Preset Thuộc Tính TMĐT Đã Định Nghĩa Sẵn:
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.keys(DYNAMIC_ATTRIBUTE_PRESETS).map(presetName => (
                <button
                  key={presetName}
                  type="button"
                  onClick={() => handleApplyPreset(presetName)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-2xs"
                >
                  + {presetName}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Key-Value Editor & JSON Code Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key-Value Editor */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-600" /> Danh Sách Attributes ({Object.keys(attributes).length})
                </h4>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {Object.keys(attributes).length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">
                    Chưa có thuộc tính động nào. Thêm bên dưới hoặc áp dụng Preset.
                  </p>
                ) : (
                  Object.entries(attributes).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="w-2/5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 truncate"
                      />
                      <span className="text-slate-400 font-bold">:</span>
                      <input
                        type="text"
                        value={String(val)}
                        onChange={e => handleUpdateValue(key, e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(key)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa thuộc tính"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Key-Value Inputs */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-600">Thêm thuộc tính mới thủ công:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKey}
                    onChange={e => setNewKey(e.target.value)}
                    placeholder="Tên thuộc tính (VD: Cam kết GMV)"
                    className="w-1/2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    placeholder="Giá trị (VD: 30%)"
                    className="w-1/2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RAW JSON Schema Viewer */}
            <div className="bg-slate-50 text-slate-800 p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900">PostgreSQL JSONB Field Preview</h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã Copy' : 'Copy JSON'}
                  </button>
                </div>

                <div className="mt-4 bg-white p-4 rounded-xl font-mono text-xs text-slate-800 overflow-x-auto border border-slate-200 max-h-80">
                  <pre>{JSON.stringify(attributes, null, 2)}</pre>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Database column: <code className="text-blue-700">products.attributes (JSONB)</code></span>
                <span className="text-emerald-600 font-bold">✓ Valid JSON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Lưu Thuộc Tính JSONB
          </button>
        </div>
      </div>
    </div>
  );
}
