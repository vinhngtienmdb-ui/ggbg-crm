'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Tag, Sparkles, Code, Check } from 'lucide-react';
import { DYNAMIC_ATTRIBUTE_PRESETS } from '@/lib/productStore';

interface JsonbAttributeEditorProps {
  attributes: Record<string, any>;
  onChange: (updatedAttrs: Record<string, any>) => void;
}

export default function JsonbAttributeEditor({ attributes, onChange }: JsonbAttributeEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [showJsonCode, setShowJsonCode] = useState(false);

  const handleAddAttribute = () => {
    if (!newKey.trim()) return;
    const updated = { ...attributes, [newKey.trim()]: newValue.trim() };
    onChange(updated);
    setNewKey('');
    setNewValue('');
  };

  const handleRemoveAttribute = (key: string) => {
    const updated = { ...attributes };
    delete updated[key];
    onChange(updated);
  };

  const handleUpdateValue = (key: string, val: string) => {
    const updated = { ...attributes, [key]: val };
    onChange(updated);
  };

  const handleApplyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const presetData = DYNAMIC_ATTRIBUTE_PRESETS[presetKey];
    if (presetData) {
      onChange({ ...attributes, ...presetData });
    }
  };

  return (
    <div className="space-y-4 bg-surface-subtle p-4 rounded-xl border border-line">
      {/* Header & Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-line">
        <div>
          <h4 className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-brand-600" /> Tùy Biến Thuộc Tính Động (Dynamic JSONB Attributes)
          </h4>
          <p className="text-[11px] text-ink-500 mt-0.5">
            Thêm bớt trường dữ liệu JSONB tùy biến cho các gói TMĐT Shopee, TikTok, Lazada, Amazon
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJsonCode(!showJsonCode)}
            className="px-2.5 py-1 bg-white border border-line hover:bg-line-soft text-ink-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            {showJsonCode ? 'Thu gọn JSON' : 'Xem RAW JSON'}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-ink-500 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-warn-fg" /> Mẫu Preset TMĐT:
        </span>
        {Object.keys(DYNAMIC_ATTRIBUTE_PRESETS).map((presetName) => (
          <button
            key={presetName}
            type="button"
            onClick={() => handleApplyPreset(presetName)}
            className="px-2.5 py-1 bg-white hover:bg-brand-50 border border-line text-ink-700 hover:text-brand-800 hover:border-brand-200 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all"
          >
            + {presetName}
          </button>
        ))}
      </div>

      {/* RAW JSON View Toggle */}
      {showJsonCode && (
        <div className="bg-white text-success-dot p-3 rounded-xl font-mono text-[11px] overflow-x-auto border border-line">
          <pre>{JSON.stringify(attributes, null, 2)}</pre>
        </div>
      )}

      {/* Key-Value Pair Editor List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {Object.keys(attributes).length === 0 ? (
          <p className="text-xs text-ink-400 italic text-center py-3">Chưa có thuộc tính động nào. Vui lòng thêm thuộc tính bên dưới.</p>
        ) : (
          Object.entries(attributes).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-line">
              <input
                type="text"
                value={key}
                disabled
                className="w-1/3 px-2 py-1 bg-line-soft border border-line rounded text-xs font-semibold text-ink-700 truncate"
              />
              <span className="text-ink-400 font-bold">:</span>
              <input
                type="text"
                value={val}
                onChange={e => handleUpdateValue(key, e.target.value)}
                className="w-full px-2 py-1 border border-line rounded text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
              <button
                type="button"
                onClick={() => handleRemoveAttribute(key)}
                className="p-1 text-ink-400 hover:text-danger-fg hover:bg-danger-bg rounded transition-colors"
                title="Xóa thuộc tính"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add New Key-Value Pair Controls */}
      <div className="pt-2 border-t border-line flex items-center gap-2">
        <input
          type="text"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          placeholder="Tên thuộc tính (VD: Cam kết ROAS)"
          className="w-1/3 px-3 py-1.5 bg-white border border-line rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
        <input
          type="text"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          placeholder="Giá trị (VD: >= 4.5)"
          className="w-full px-3 py-1.5 bg-white border border-line rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
        <button
          type="button"
          onClick={handleAddAttribute}
          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm Trường
        </button>
      </div>
    </div>
  );
}
