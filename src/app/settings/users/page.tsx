'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Plus,
  Search,
  Lock,
  Unlock,
  KeyRound,
  UserPlus,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { UserAccount, UserRole } from '@/types';

export default function UserAccountsPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form fields
  const [selectedHrmEmp, setSelectedHrmEmp] = useState('NV-00108');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SALE_EXEC');
  const [notification, setNotification] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.users) {
          setUsers(data.users);
        }
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleAccountStatus = async (id: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        const targetUser = data.users.find((u: UserAccount) => u.id === id);
        const statusText = targetUser?.account_status === 'Active' ? 'kích hoạt' : 'khóa';
        showToast(`Đã ${statusText} tài khoản thành công!`);
      } else {
        showToast(data.message || 'Lỗi cập nhật trạng thái');
      }
    } catch (e) {
      showToast('Không thể kết nối đến server');
    }
  };

  const handleCreateUserFromHRM = async () => {
    if (!newUsername || !newPassword) {
      showToast('Vui lòng nhập Tên đăng nhập và Mật khẩu!');
      return;
    }

    const empName = selectedHrmEmp === 'NV-00108' ? 'Phạm Minh Đức' : 'Vũ Nam Khánh';
    const roleName = selectedRole === 'SALE_EXEC' ? 'Nhân Viên Sale Exec' :
                     selectedRole === 'TEAM_LEADER' ? 'Trưởng Nhóm Sale' :
                     selectedRole === 'HR_MANAGER' ? 'Quản Lý HR' : 'Chuyên Viên System';

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_code: selectedHrmEmp,
          employee_name: `${empName} (Mới từ HRM)`,
          username: newUsername,
          email: `${newUsername}@ggbingo.vn`,
          password: newPassword,
          role: selectedRole,
          role_name: roleName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchUsers();
        setNewUsername('');
        setNewPassword('');
        setIsModalOpen(false);
        showToast('Cấp tài khoản mới thành công!');
      } else {
        showToast(data.message || 'Lỗi khi cấp tài khoản');
      }
    } catch (e) {
      showToast('Không thể kết nối đến server');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && (u.account_status || 'Active').toUpperCase() === statusFilter.toUpperCase();
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-brand-50 text-brand-800 px-4 py-3 rounded-xl shadow-cardLg border border-line flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-success-dot" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-line shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink-900">Quản Lý User Sử Dụng Hệ Thống</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 text-xs font-semibold border border-brand-100">
              Gắn Liền HRM & RBAC
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Cấp tài khoản truy cập CRM từ Hồ sơ Nhân sự (HRM), Bật/Tắt tài khoản và Phân quyền vai trò
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-brand-600/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Cấp Tài Khoản Mới Từ HRM
        </button>
      </div>

      {/* Super Admin Info Card */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-white p-5 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-brand-600/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-warn-fg text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-card">
            SA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Tài Khoản Super Admin Mặc Định</h3>
              <span className="px-2 py-0.5 bg-warn-fg text-ink-900 rounded text-[10px] font-black uppercase">Active</span>
            </div>
            <p className="text-xs text-ink-400 mt-0.5">
              Tài khoản quản trị tối cao của hệ thống • Đã bảo mật thông tin xác thực
            </p>
          </div>
        </div>
        <div className="text-xs text-ink-400 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
          Quyền Hạn: Super Admin (Toàn Quyền Hệ Thống)
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Username, Mã NV, Tên nhân sự..."
            className="w-full pl-10 pr-4 py-2 bg-surface-subtle border border-line rounded-xl text-xs text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Active', 'Locked'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter.toUpperCase() === status.toUpperCase()
                  ? 'bg-brand-50 text-brand-800'
                  : 'bg-line-soft text-ink-500 hover:bg-line'
              }`}
            >
              {status === 'ALL' && 'Tất Cả Trạng Thái'}
              {status === 'Active' && '🟢 Đang Hoạt Động'}
              {status === 'Locked' && '🔴 Đã Khóa'}
            </button>
          ))}
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-500 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-brand-600" />
            Liên kết 1-1 với Bảng Profiles Hồ Sơ Nhân Sự (HRM)
          </span>
          <span className="text-xs text-ink-400">Hiển thị {filteredUsers.length} tài khoản</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-line-soft border-b border-line text-ink-500 font-bold uppercase tracking-wider">
                <th className="p-4">Username & Email Access</th>
                <th className="p-4">Nhân Sự HRM Liên Kết</th>
                <th className="p-4">Vai Trò System (Role)</th>
                <th className="p-4">Trạng Thái Tài Khoản</th>
                <th className="p-4">Đăng Nhập Cuối</th>
                <th className="p-4 text-center">Thao Tác Kích Hoạt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-400 font-semibold">
                    Đang tải danh sách tài khoản...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-400">
                    Không tìm thấy tài khoản phù hợp
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = (user.account_status || 'Active').toUpperCase() === 'ACTIVE';
                  return (
                    <tr key={user.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs ${
                              user.is_super_admin
                                ? 'bg-warn-fg text-white'
                                : 'bg-brand-50 text-brand-800 border border-brand-100'
                            }`}
                          >
                            {user.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-ink-900 text-sm flex items-center gap-1.5">
                              {user.username}
                              {user.is_super_admin && (
                                <span className="px-1.5 py-0.2 bg-warn-fg text-white rounded text-[9px] font-black">
                                  SUPER ADMIN
                                </span>
                              )}
                            </p>
                            <p className="text-ink-500 font-mono text-[11px]">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-ink-900">{user.employee_name}</p>
                        <p className="text-ink-400 font-mono text-[11px]">Mã NV: {user.employee_code}</p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            user.role === 'SUPER_ADMIN'
                              ? 'bg-warn-bg text-warn-fg border border-gold-border'
                              : user.role === 'TEAM_LEADER'
                              ? 'bg-brand-300 text-brand-800'
                              : user.role === 'HR_MANAGER'
                              ? 'bg-plum-bg text-plum-fg'
                              : 'bg-line-soft text-ink-700'
                          }`}
                        >
                          {user.role_name}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-success-bg text-success-fg' : 'bg-danger-bg text-danger-fg'
                          }`}
                        >
                          {isActive ? '🟢 Hoạt Động' : '🔴 Đã Khóa'}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-ink-500">{user.last_login_at || 'Chưa đăng nhập'}</td>

                      <td className="p-4 text-center">
                        {!user.is_super_admin ? (
                          <button
                            onClick={() => toggleAccountStatus(user.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 mx-auto ${
                              isActive
                                ? 'bg-danger-bg text-danger-fg hover:bg-danger-hover border border-danger-border'
                                : 'bg-success-bg text-success-fg hover:bg-success-hover border border-success-border'
                            }`}
                          >
                            {isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            {isActive ? 'Khóa Tài Khoản' : 'Mở Khóa'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-ink-400 italic">Bảo vệ mặc định</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Grant System User from HRM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cardLg border border-line w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-bold text-ink-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-600" />
                Cấp Tài Khoản Từ Nhân Sự HRM
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-400 hover:text-ink-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Chọn Nhân Sự HRM</label>
                <select
                  value={selectedHrmEmp}
                  onChange={(e) => setSelectedHrmEmp(e.target.value)}
                  className="w-full p-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-medium"
                >
                  <option value="NV-00108">Phạm Minh Đức (NV-00108 - Sale Exec)</option>
                  <option value="NV-00109">Vũ Nam Khánh (NV-00109 - Ops Specialist)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Tên Đăng Nhập (Username)</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="VD: duc.pm"
                  className="w-full p-2.5 bg-surface-subtle border border-line rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Mật Khẩu Ban Đầu</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full p-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Vai Trò Hệ Thống (Role)</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-medium"
                >
                  <option value="SALE_EXEC">Nhân Viên Sale Exec</option>
                  <option value="TEAM_LEADER">Trưởng Nhóm Sale</option>
                  <option value="HR_MANAGER">Quản Lý HR</option>
                  <option value="DIRECTOR">Ban Giám Đốc</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateUserFromHRM}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/20"
              >
                Tạo Tài Khoản & Kích Hoạt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
