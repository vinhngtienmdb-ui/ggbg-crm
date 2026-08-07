'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Settings,
  Tag,
  ShieldCheck,
  CheckCircle,
  Edit3,
  Trash2,
  Filter,
  Sparkles,
  Code,
  LayoutGrid,
  List,
  DollarSign,
  Percent,
  Check,
  Power
} from 'lucide-react';
import { ProductPackage, EcomPlatform } from '@/types';
import { getProducts, createProduct, updateProduct, deleteProduct, ECOM_PLATFORM_OPTIONS } from '@/lib/productStore';
import dynamic from 'next/dynamic';

const ProductPackageModal = dynamic(() => import('@/components/products/ProductPackageModal'), { ssr: false });
const JsonbSchemaBuilderModal = dynamic(() => import('@/components/products/JsonbSchemaBuilderModal'), { ssr: false });

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductPackage[]>(() => getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modal State
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageModalMode, setPackageModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | null>(null);

  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [targetSchemaProductId, setTargetSchemaProductId] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform =
      selectedPlatform === 'ALL' || (p.platforms && p.platforms.includes(selectedPlatform as EcomPlatform));

    return matchesSearch && matchesPlatform;
  });

  const handleSavePackage = (pkgData: Partial<ProductPackage>) => {
    if (packageModalMode === 'create') {
      createProduct(pkgData as any);
      setProducts(getProducts());
    } else if (selectedPackage) {
      updateProduct(selectedPackage.id, pkgData);
      setProducts(getProducts());
    }
  };

  const handleSaveAttributesFromSchemaBuilder = (productId: string, updatedAttributes: Record<string, any>) => {
    updateProduct(productId, { attributes: updatedAttributes });
    setProducts(getProducts());
  };

  const handleToggleActive = (pkg: ProductPackage) => {
    updateProduct(pkg.id, { is_active: !pkg.is_active });
    setProducts(getProducts());
  };

  const handleDeletePackage = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gg-hero p-5 md:p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(46,92,230,0.12),transparent_70%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-blue-700">Quản Lý Sản Phẩm & Gói Dịch Vụ Admin Custom</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10.5px] font-bold border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" /> CRM SaaS, Tư Vấn & Bảo Trì Cloud
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1 max-w-2xl leading-relaxed">
              Thiết lập Mã SP, Đơn vị tính (Tháng/Năm/Dự án), Giá niêm yết, Giá sàn duyệt tối thiểu, VAT (%) và Trạng thái Active/Inactive
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTargetSchemaProductId(products[0]?.id || '');
                setIsSchemaModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4 text-blue-600" />
              Tùy Biến Thuộc Tính JSONB
            </button>
            <button
              onClick={() => {
                setSelectedPackage(null);
                setPackageModalMode('create');
                setIsPackageModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Tạo Gói Dịch Vụ Mới
            </button>
          </div>
        </div>
      </div>

      {/* Filter, View Switcher & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'GRID' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Lưới Card
            </button>

            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'TABLE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Bảng Báo Giá
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Mã SKU, Tên gói..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* E-commerce Platform Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sàn / Nền Tảng:
          </span>
          <button
            onClick={() => setSelectedPlatform('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPlatform === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất Cả
          </button>
          {ECOM_PLATFORM_OPTIONS.map((plat) => (
            <button
              key={plat.id}
              onClick={() => setSelectedPlatform(plat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedPlatform === plat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {plat.name}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODE 1: GRID CARDS */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border ${
                product.is_active ? 'border-slate-200/80' : 'border-slate-200 opacity-60'
              } p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded border border-blue-100">
                    {product.sku_code}
                  </span>
                  
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                      product.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {product.is_active ? '● Active (Kinh Doanh)' : '○ Inactive (Tạm Dừng)'}
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{product.category}</p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Giá Niêm Yết & Giá Sàn Tối Thiểu</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {product.base_price.toLocaleString('vi-VN')} ₫{' '}
                    <span className="text-xs font-normal text-slate-500">/ {product.unit}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-emerald-700 font-bold">Giá sàn duyệt: {(product.base_price * 0.85).toLocaleString('vi-VN')} ₫</span>
                    <span className="text-slate-500 font-semibold">+ VAT {product.vat_rate}%</span>
                  </div>
                </div>

                {/* Dynamic JSONB Attributes */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-blue-600" /> Thuộc tính gói (JSONB):
                  </p>
                  <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100 max-h-36 overflow-y-auto">
                    {Object.entries(product.attributes || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-xs py-1 border-b border-slate-100/80 last:border-none">
                        <span className="text-slate-500 font-medium">{key}:</span>
                        <span className="font-semibold text-slate-800 text-right ml-2">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPackage(product);
                    setPackageModalMode('edit');
                    setIsPackageModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Sửa Cấu Hình
                </button>
                <button
                  onClick={() => handleDeletePackage(product.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: QUOTATION TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10.5px] font-bold uppercase tracking-wide">
                  <th className="p-4">Mã SP & Tên Gói</th>
                  <th className="p-4">Danh Mục Dịch Vụ</th>
                  <th className="p-4">Đơn Vi Tính</th>
                  <th className="p-4">Giá Niêm Yết (VNĐ)</th>
                  <th className="p-4">Giá Sàn Tối Thiểu</th>
                  <th className="p-4">VAT (%)</th>
                  <th className="p-4">Trạng Thái Kinh Doanh</th>
                  <th className="p-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      <span className="font-mono text-blue-700 text-xs block">{p.sku_code}</span>
                      {p.name}
                    </td>
                    <td className="p-4 text-slate-700 font-semibold">{p.category}</td>
                    <td className="p-4 font-semibold text-slate-800">{p.unit}</td>
                    <td className="p-4 font-mono font-bold text-blue-600 text-sm">
                      {p.base_price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-700">
                      {(p.base_price * 0.85).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-700">{p.vat_rate}%</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.is_active ? '● Active' : '○ Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedPackage(p);
                          setPackageModalMode('edit');
                          setIsPackageModalOpen(true);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Package Modal */}
      <ProductPackageModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        onSave={handleSavePackage}
        initialData={selectedPackage}
        mode={packageModalMode}
      />

      {/* Dynamic JSONB Schema Builder Modal */}
      <JsonbSchemaBuilderModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        products={products}
        onSaveAttributes={handleSaveAttributesFromSchemaBuilder}
        initialProductId={targetSchemaProductId}
      />
    </div>
  );
}
