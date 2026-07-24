'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Tag, Settings, Plus, Check } from 'lucide-react';
import { ProductPackage, EcomPlatform } from '@/types';
import { ECOM_PLATFORM_OPTIONS } from '@/lib/productStore';
import JsonbAttributeEditor from './JsonbAttributeEditor';

interface ProductPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: Partial<ProductPackage>) => void;
  initialData?: ProductPackage | null;
  mode?: 'create' | 'edit';
}

export default function ProductPackageModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}: ProductPackageModalProps) {
  const [formData, setFormData] = useState<Partial<ProductPackage>>({
    sku_code: '',
    name: '',
    category: 'Vận Hành Gian Hàng TMĐT',
    unit: 'Tháng',
    base_price: 20000000,
    vat_rate: 10,
    platforms: ['Shopee'],
    attributes: {
      'Thời hạn hợp đồng': '12 Tháng',
      'Cam kết tăng trưởng GMV': '20%',
    },
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        sku_code: `PKG-OPS-${Date.now().toString().slice(-6)}`,
        name: '',
        category: 'Vận Hành Gian Hàng TMĐT',
        unit: 'Tháng',
        base_price: 25000000,
        vat_rate: 10,
        platforms: ['Shopee', 'TikTokShop'],
        attributes: {
          'Thời hạn hợp đồng': '12 Tháng',
          'Cam kết tăng trưởng GMV': '25%',
          'SLA Phản hồi Chat': '< 15 Phút',
        },
        is_active: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTogglePlatform = (platform: EcomPlatform) => {
    const current = formData.platforms || [];
    if (current.includes(platform)) {
      setFormData({ ...formData, platforms: current.filter(p => p !== platform) });
    } else {
      setFormData({ ...formData, platforms: [...current, platform] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center font-bold text-white shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'create' ? 'Tạo Gói Dịch Vụ Mới' : `Chỉnh Sửa Gói: ${formData.name}`}
              </h2>
              <p className="text-xs text-slate-300">
                Mã SKU: <span className="font-mono text-cyan-300 font-bold">{formData.sku_code}</span> • Cấu hình thuộc tính JSONB TMĐT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Package Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mã SKU Gói *</label>
              <input
                type="text"
                value={formData.sku_code || ''}
                onChange={e => setFormData({ ...formData, sku_code: e.target.value })}
                placeholder="PKG-OPS-SHOPEE-PRO"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Gói Dịch Vụ *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Gói Dịch Vụ Vận Hành Shopee Mall Pro"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Danh Mục Dịch Vụ *</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="Vận Hành Gian Hàng TMĐT"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn Vị Tính *</label>
              <select
                value={formData.unit || 'Tháng'}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tháng">Tháng</option>
                <option value="Quý">Quý</option>
                <option value="Năm">Năm</option>
                <option value="Gói">Gói / Dự Án</option>
                <option value="Phiên Live">Phiên Livestream</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn Giá Niêm Yết (VND) *</label>
              <input
                type="number"
                value={formData.base_price || 0}
                onChange={e => setFormData({ ...formData, base_price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Thuế VAT (%) *</label>
              <input
                type="number"
                value={formData.vat_rate || 10}
                onChange={e => setFormData({ ...formData, vat_rate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* E-commerce Supported Platforms */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Nền Tảng TMĐT Hỗ Trợ *</label>
            <div className="flex flex-wrap gap-2">
              {ECOM_PLATFORM_OPTIONS.map((plat) => {
                const isSelected = (formData.platforms || []).includes(plat.id);
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => handleTogglePlatform(plat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    {plat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic JSONB Attributes Builder */}
          <JsonbAttributeEditor
            attributes={formData.attributes || {}}
            onChange={updatedAttrs => setFormData({ ...formData, attributes: updatedAttrs })}
          />

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              {mode === 'create' ? 'Tạo Gói Dịch Vụ' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
