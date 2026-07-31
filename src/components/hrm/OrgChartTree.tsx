'use client';

import React, { useState } from 'react';
import { Building2, Users, ChevronDown, ChevronRight, UserCheck, Search, ShieldCheck, Mail, Phone } from 'lucide-react';
import { OrgNode } from '@/types';

interface OrgChartTreeProps {
  rootData: OrgNode;
  onSelectMember?: (name: string) => void;
}

function OrgTreeNode({
  node,
  level = 0,
  onSelectMember,
  searchTerm = '',
}: {
  node: OrgNode;
  level?: number;
  onSelectMember?: (name: string) => void;
  searchTerm?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const matchesSearch =
    searchTerm.trim() !== '' &&
    (node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.department.toLowerCase().includes(searchTerm.toLowerCase()));

  const levelColors = [
    'bg-blue-600 text-white border-blue-700',
    'bg-blue-500 text-white border-blue-400',
    'bg-blue-50 border-blue-200 text-slate-900',
    'bg-white border-slate-200 text-slate-900',
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className="relative group">
        <div
          onClick={() => {
            if (hasChildren) setIsExpanded(!isExpanded);
            if (onSelectMember) onSelectMember(node.name);
          }}
          className={`p-4 rounded-2xl border shadow-md transition-all cursor-pointer min-w-[240px] max-w-[280px] hover:shadow-xl hover:scale-105 ${
            matchesSearch
              ? 'ring-4 ring-amber-400 border-amber-500 scale-105 bg-amber-50 text-slate-900'
              : levelColors[Math.min(level, levelColors.length - 1)]
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              matchesSearch ? 'bg-amber-500 text-white' :
              level === 0 ? 'bg-orange-500 text-white' :
              level === 1 ? 'bg-blue-500 text-white' :
              level === 2 ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {level === 0 ? 'TỔNG CÔNG TY' : level === 1 ? 'PHÒNG BAN' : level === 2 ? 'ĐỘI NHÓM' : 'CÁ NHÂN'}
            </span>

            {node.memberCount && (
              <span className="text-[11px] font-bold flex items-center gap-1 opacity-80">
                <Users className="w-3 h-3" /> {node.memberCount} NV
              </span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shrink-0 border ${
              matchesSearch ? 'bg-amber-200 text-amber-900 border-amber-400' :
              level <= 1 ? 'bg-white/20 text-white border-white/30' : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {node.name.charAt(0)}
            </div>

            <div className="overflow-hidden">
              <h4 className="font-bold text-sm truncate">{node.name}</h4>
              <p className="text-xs opacity-80 truncate">{node.title || node.role}</p>
              {node.email && <p className="text-[10px] opacity-70 truncate mt-0.5">{node.email}</p>}
            </div>
          </div>

          {hasChildren && (
            <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between gap-1 text-[11px] font-bold opacity-80">
              <span className="flex items-center gap-1">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                {isExpanded ? 'Thu gọn' : `Mở rộng (${node.children?.length})`}
              </span>

              {/* Node Action Buttons */}
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => alert(`👁️ Chi tiết phòng ban / chức danh: ${node.name} - ${node.department}`)}
                  className="p-1 hover:bg-black/10 rounded"
                  title="Xem Chi Tiết"
                >
                  👁️
                </button>
                <button
                  onClick={() => alert(`✏️ Chỉnh sửa phòng ban: ${node.department}`)}
                  className="p-1 hover:bg-black/10 rounded"
                  title="Chỉnh Sửa"
                >
                  ✏️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connectors & Children */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center mt-3 w-full">
          {/* Vertical Connecting Line Down */}
          <div className="w-0.5 h-6 bg-slate-300"></div>

          {/* Children Horizontal Row */}
          <div className="flex flex-wrap justify-center gap-8 relative pt-2 border-t-2 border-slate-300">
            {node.children?.map((childNode) => (
              <div key={childNode.id} className="relative flex flex-col items-center">
                {/* Small vertical connector from top bar to node */}
                <div className="w-0.5 h-4 bg-slate-300 -mt-2 mb-2"></div>
                <OrgTreeNode node={childNode} level={level + 1} onSelectMember={onSelectMember} searchTerm={searchTerm} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrgChartTree({ rootData, onSelectMember }: OrgChartTreeProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Controls & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Sơ Đồ Cấu Trúc Tổ Chức (Visual Department Tree)</h2>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm vị trí, phòng ban, nhân sự..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Visual Tree Display Container */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-8 shadow-sm overflow-x-auto min-h-[600px] flex justify-center">
        <OrgTreeNode node={rootData} level={0} onSelectMember={onSelectMember} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
