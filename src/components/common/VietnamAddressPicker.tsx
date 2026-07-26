'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Building2, ShieldCheck, Check, Search, RefreshCw } from 'lucide-react';
import {
  getNewProvinces,
  getNewWards,
  NewProvince,
  NewWard,
  formatFullAddressPost2025,
} from '@/lib/locationService';

export interface VietnamAddressValue {
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  detailAddress: string;
  fullAddress: string;
}

interface VietnamAddressPickerProps {
  value?: Partial<VietnamAddressValue>;
  onChange: (newValue: VietnamAddressValue) => void;
  required?: boolean;
  label?: string;
  disabled?: boolean;
}

export default function VietnamAddressPicker({
  value,
  onChange,
  required = false,
  label = 'Địa Chỉ Đơn Vị Hành Chính (Theo Chuẩn Mới 01/07/2025)',
  disabled = false,
}: VietnamAddressPickerProps) {
  const [provinces, setProvinces] = useState<NewProvince[]>([]);
  const [wards, setWards] = useState<NewWard[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState(value?.provinceCode || '');
  const [selectedProvinceName, setSelectedProvinceName] = useState(value?.provinceName || '');
  const [selectedWardCode, setSelectedWardCode] = useState(value?.wardCode || '');
  const [selectedWardName, setSelectedWardName] = useState(value?.wardName || '');
  const [detailAddress, setDetailAddress] = useState(value?.detailAddress || '');

  // 1. Fetch Provinces on Mount
  useEffect(() => {
    let isMounted = true;
    setLoadingProvinces(true);
    getNewProvinces().then((data) => {
      if (isMounted) {
        setProvinces(data);
        setLoadingProvinces(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Wards when Province Code Changes
  useEffect(() => {
    if (!selectedProvinceCode) {
      setWards([]);
      return;
    }

    let isMounted = true;
    setLoadingWards(true);
    getNewWards(selectedProvinceCode).then((wardData) => {
      if (isMounted) {
        setWards(wardData);
        setLoadingWards(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedProvinceCode]);

  // Sync internal state when external prop value changes meaningfully
  useEffect(() => {
    if (value?.provinceCode !== undefined && value.provinceCode !== selectedProvinceCode) {
      setSelectedProvinceCode(value.provinceCode);
    }
    if (value?.provinceName !== undefined && value.provinceName !== selectedProvinceName) {
      setSelectedProvinceName(value.provinceName);
    }
    if (value?.wardCode !== undefined && value.wardCode !== selectedWardCode) {
      setSelectedWardCode(value.wardCode);
    }
    if (value?.wardName !== undefined && value.wardName !== selectedWardName) {
      setSelectedWardName(value.wardName);
    }
    if (value?.detailAddress !== undefined && value.detailAddress !== detailAddress) {
      setDetailAddress(value.detailAddress);
    }
  }, [value]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pCode = e.target.value;
    const found = provinces.find((p) => p.code === pCode);
    const pName = found ? `${found.type} ${found.name}` : '';

    setSelectedProvinceCode(pCode);
    setSelectedProvinceName(pName);

    // Reset ward when province changes
    setSelectedWardCode('');
    setSelectedWardName('');

    const full = formatFullAddressPost2025(detailAddress, '', pName);
    onChange({
      provinceCode: pCode,
      provinceName: pName,
      wardCode: '',
      wardName: '',
      detailAddress,
      fullAddress: full,
    });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wCode = e.target.value;
    const found = wards.find((w) => w.code === wCode);
    const wName = found ? `${found.type} ${found.name}` : '';

    setSelectedWardCode(wCode);
    setSelectedWardName(wName);

    const full = formatFullAddressPost2025(detailAddress, wName, selectedProvinceName);
    onChange({
      provinceCode: selectedProvinceCode,
      provinceName: selectedProvinceName,
      wardCode: wCode,
      wardName: wName,
      detailAddress,
      fullAddress: full,
    });
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dAddress = e.target.value;
    setDetailAddress(dAddress);

    const full = formatFullAddressPost2025(dAddress, selectedWardName, selectedProvinceName);
    onChange({
      provinceCode: selectedProvinceCode,
      provinceName: selectedProvinceName,
      wardCode: selectedWardCode,
      wardName: selectedWardName,
      detailAddress: dAddress,
      fullAddress: full,
    });
  };

  const currentFullAddress = formatFullAddressPost2025(
    detailAddress,
    selectedWardName,
    selectedProvinceName
  );

  return (
    <div className="space-y-3 p-4 bg-surface-subtle rounded-2xl border border-line text-xs">
      {/* Label & Official Standard Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-line pb-2">
        <label className="font-extrabold text-ink-900 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-danger-fg" />
          <span>{label}</span>
          {required && <span className="text-danger-fg">*</span>}
        </label>

        <span className="px-2.5 py-0.5 bg-danger-bg text-danger-fg border border-danger-border rounded-full font-mono text-[10px] font-bold flex items-center gap-1 w-fit">
          🇻🇳 Đơn Vị Hành Chính Chuẩn Sau 01/07/2025
        </span>
      </div>

      {/* Select Grid: Province & Ward */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Dropdown 1: Tỉnh / Thành Phố (Sau 01/07/2025) */}
        <div>
          <label className="block font-bold text-ink-700 mb-1">
            Tỉnh / Thành Phố (Mới 2025) {required && <span className="text-danger-fg">*</span>}:
          </label>
          <select
            disabled={disabled || loadingProvinces}
            value={selectedProvinceCode}
            onChange={handleProvinceChange}
            required={required}
            className="w-full px-3 py-2 bg-white border border-line-strong rounded-xl font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-danger-fg/20 focus:border-danger-border disabled:bg-line-soft"
          >
            <option value="">-- Chọn Tỉnh / Thành Phố --</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.type} {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown 2: Phường / Xã (Sau 01/07/2025) */}
        <div>
          <label className="block font-bold text-ink-700 mb-1">
            Phường / Xã / Thị Trấn {required && <span className="text-danger-fg">*</span>}:
          </label>
          <select
            disabled={disabled || !selectedProvinceCode || loadingWards}
            value={selectedWardCode}
            onChange={handleWardChange}
            required={required}
            className="w-full px-3 py-2 bg-white border border-line-strong rounded-xl font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-danger-fg/20 focus:border-danger-border disabled:bg-line-soft"
          >
            <option value="">
              {!selectedProvinceCode
                ? '-- Chọn Tỉnh trước --'
                : loadingWards
                ? 'Đang tải danh sách Phường/Xã...'
                : '-- Chọn Phường / Xã --'}
            </option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.type} {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input 3: Số nhà, Tên đường... */}
      <div>
        <label className="block font-bold text-ink-700 mb-1">
          Địa Chỉ Chi Tiết (Số nhà, Tên đường, Tòa nhà...) {required && <span className="text-danger-fg">*</span>}:
        </label>
        <input
          type="text"
          disabled={disabled}
          value={detailAddress}
          onChange={handleDetailChange}
          required={required}
          placeholder="VD: Số 188 Nguyễn Trãi, Tòa A..."
          className="w-full px-3 py-2 bg-white border border-line-strong rounded-xl font-medium text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-danger-fg/20 focus:border-danger-border disabled:bg-line-soft"
        />
      </div>

      {/* Full Formatted Address Preview */}
      {currentFullAddress && (
        <div className="p-2.5 bg-white border border-danger-border/80 rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success-fg shrink-0" />
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-ink-500 block">Địa chỉ chuẩn hoá (API tinhthanhpho.com):</span>
            <span className="font-bold text-ink-900 truncate block">{currentFullAddress}</span>
          </div>
        </div>
      )}
    </div>
  );
}
