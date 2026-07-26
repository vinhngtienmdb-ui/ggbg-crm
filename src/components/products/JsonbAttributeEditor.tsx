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
    <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
      {/* Header & Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-blue-600" /> Tùy Biến Thuộc Tính Động (Dynamic JSONB Attributes)
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Thêm bớt trường dữ liệu JSONB tùy biến cho các gói TMĐT Shopee, TikTok, Lazada, Amazon
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJsonCode(!showJsonCode)}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            {showJsonCode ? 'Thu gọn JSON' : 'Xem RAW JSON'}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Mẫu Preset TMĐT:
        </span>
        {Object.keys(DYNAMIC_ATTRIBUTE_PRESETS).map((presetName) => (
          <button
            key={presetName}
            type="button"
            onClick={() => handleApplyPreset(presetName)}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shadow-2xs"
          >
            + {presetName}
          </button>
        ))}
      </div>

      {/* RAW JSON View Toggle */}
      {showJsonCode && (
        <div className="bg-slate-50 text-slate-800 p-3 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-200">
          <pre>{JSON.stringify(attributes, null, 2)}</pre>
        </div>
      )}

      {/* Key-Value Pair Editor List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {Object.keys(attributes).length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-3">Chưa có thuộc tính động nào. Vui lòng thêm thuộc tính bên dưới.</p>
        ) : (
          Object.entries(attributes).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <input
                type="text"
                value={key}
                disabled
                className="w-1/3 px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 truncate"
              />
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={val}
                onChange={e => handleUpdateValue(key, e.target.value)}
                className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveAttribute(key)}
                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Xóa thuộc tính"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add New Key-Value Pair Controls */}
      <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          placeholder="Tên thuộc tính (VD: Cam kết ROAS)"
          className="w-1/3 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          placeholder="Giá trị (VD: >= 4.5)"
          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAddAttribute}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm Trường
        </button>
      </div>
    </div>
  );
}
