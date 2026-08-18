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
  X,
  Eye,
  Edit,
  Trash2,
  ShieldAlert,
  QrCode,
  Save,
  User
} from 'lucide-react';
import { UserAccount, UserRole } from '@/types';

const ROLES_LIST: { id: UserRole; name: string }[] = [
  { id: 'SUPER_ADMIN', name: 'Super Admin (Toàn Quyền)' },
  { id: 'DIRECTOR', name: 'Ban Giám Đốc (Executive)' },
  { id: 'SALES_MANAGER', name: 'Quản Lý Sales Manager' },
  { id: 'TEAM_LEADER', name: 'Trưởng Nhóm Sale' },
  { id: 'SALE_EXEC', name: 'Nhân Viên Sale Exec' },
  { id: 'HR_MANAGER', name: 'Quản Lý HR' },
  { id: 'CSKH', name: 'Chuyên Viên CSKH' },
  { id: 'AUDITOR', name: 'Kiểm Toán Viên (Auditor)' },
];

export default function UserAccountsPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  // Form fields for Create / Edit
  const [selectedHrmEmp, setSelectedHrmEmp] = useState('NV-00108');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEmployeeName, setFormEmployeeName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('SALE_EXEC');
  const [formStatus, setFormStatus] = useState<'Active' | 'Locked' | 'Inactive'>('Active');
  const [adminResetPass, setAdminResetPass] = useState('');

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
    setTimeout(() => setNotification(null), 3500);
  };

  // Toggle Account Status
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

  // Delete User Account
  const handleDeleteUser = async (user: UserAccount) => {
    if (user.is_super_admin || user.username === 'admin') {
      showToast('⚠️ Không thể xóa tài khoản Super Admin chính hệ thống!');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa hẳn tài khoản "${user.username}" (${user.employee_name}) khỏi hệ thống?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users?id=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        showToast(`🗑 Đã xóa thành công tài khoản ${user.username}!`);
      } else {
        showToast(data.message || 'Lỗi xóa tài khoản');
      }
    } catch (e) {
      showToast('Lỗi kết nối máy chủ');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormUsername('');
    setFormPassword('');
    setSelectedHrmEmp('NV-00108');
    setFormRole('SALE_EXEC');
    setIsCreateModalOpen(true);
  };

  // Create User Handler
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername || !formPassword) {
      showToast('Vui lòng nhập Tên đăng nhập và Mật khẩu!');
      return;
    }

    const empName = selectedHrmEmp === 'NV-00108' ? 'Phạm Minh Đức' : 'Vũ Nam Khánh';
    const roleObj = ROLES_LIST.find((r) => r.id === formRole);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_code: selectedHrmEmp,
          employee_name: `${empName} (Mới từ HRM)`,
          username: formUsername,
          email: `${formUsername}@ggbingo.vn`,
          password: formPassword,
          role: formRole,
          role_name: roleObj?.name || 'Nhân Viên System',
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchUsers();
        setIsCreateModalOpen(false);
        showToast('🎉 Cấp tài khoản mới từ HRM thành công!');
      } else {
        showToast(data.message || 'Lỗi khi cấp tài khoản');
      }
    } catch (e) {
      showToast('Không thể kết nối đến server');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: UserAccount) => {
    setSelectedUser(user);
    setFormEmployeeName(user.employee_name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.account_status);
    setIsEditModalOpen(true);
  };

  // Submit Edit User
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const roleObj = ROLES_LIST.find((r) => r.id === formRole);

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedUser.id,
          employee_name: formEmployeeName,
          email: formEmail,
          role: formRole,
          role_name: roleObj?.name || 'Nhân Viên System',
          account_status: formStatus,
        }),
      });

      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        setIsEditModalOpen(false);
        showToast(`✏ Đã cập nhật thành công tài khoản ${selectedUser.username}!`);
      } else {
        showToast(data.message || 'Lỗi cập nhật');
      }
    } catch (e) {
      showToast('Lỗi kết nối server');
    }
  };

  // Open Admin Reset Password Modal
  const handleOpenResetPassModal = (user: UserAccount) => {
    setSelectedUser(user);
    setAdminResetPass('');
    setIsResetPassModalOpen(true);
  };

  // Submit Admin Reset Password
  const handleAdminResetPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adminResetPass) return;

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESET_PASSWORD',
          id: selectedUser.id,
          new_password: adminResetPass,
        }),
      });

      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        setIsResetPassModalOpen(false);
        showToast(`🔑 Đã reset mật khẩu cho tài khoản ${selectedUser.username} thành công!`);
      } else {
        showToast(data.message || 'Lỗi reset mật khẩu');
      }
    } catch (e) {
      showToast('Lỗi kết nối server');
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
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-purple-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header - Clean White with Colorful Highlights */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Quản Lý Tài Khoản Người Dùng
              </h1>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-medium border border-purple-200 dark:border-purple-800">
                {users.length} Tài khoản
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Quản trị danh sách tài khoản, phân quyền vai trò, cấp tài khoản từ HRM, reset mật khẩu & bảo mật 2FA
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> + Cấp Tài Khoản Từ HRM
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs font-medium">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên đăng nhập, email, nhân viên..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 text-xs"
            >
              <option value="ALL">Tất Cả Trạng Thái</option>
              <option value="ACTIVE">🟢 Đang Hoạt Động (Active)</option>
              <option value="LOCKED">🔒 Đã Khóa (Locked)</option>
            </select>
          </div>
          <span className="text-slate-500 font-semibold shrink-0">
            Tổng cộng: <strong className="text-purple-700 dark:text-purple-400">{filteredUsers.length}</strong> tài khoản
          </span>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10.5px]">
                <th className="p-3">Tài Khoản & Nhân Viên HRM</th>
                <th className="p-3">Email & Đăng Nhập Cuối</th>
                <th className="p-3">Vai Trò Phân Quyền (RBAC)</th>
                <th className="p-3 text-center">Bảo Mật 2FA</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-center">Thao Tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Đang tải danh sách tài khoản...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Không tìm thấy tài khoản người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                          {u.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                            {u.username}
                            {u.is_super_admin && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-semibold text-[9.5px]">
                                ADMIN
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            [{u.employee_code}] {u.employee_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-slate-700 dark:text-slate-300 font-mono text-[11.5px]">{u.email}</p>
                      <p className="text-[10.5px] text-slate-400">📅 {u.last_login_at || 'Vừa khởi tạo'}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-full font-medium text-[10.5px] inline-block">
                        {u.role_name}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {u.is_2fa_enabled ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-semibold border border-emerald-300">
                          Đã Bật 2FA
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10.5px] font-medium">
                          ⚪ Tắt 2FA
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-semibold text-[10.5px] ${
                          u.account_status === 'Active' || (u.account_status as string) === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-300'
                        }`}
                      >
                        {u.account_status === 'Active' || (u.account_status as string) === 'ACTIVE'
                          ? '🟢 Active'
                          : '🔒 Locked'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 rounded-lg text-[11px] font-medium cursor-pointer"
                          title="Xem thông tin chi tiết tài khoản"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 rounded-lg text-[11px] font-medium cursor-pointer"
                          title="Chỉnh sửa thông tin / Vai trò"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenResetPassModal(u)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 rounded-lg text-[11px] font-medium cursor-pointer"
                          title="Reset Mật Khẩu Người Dùng"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleAccountStatus(u.id)}
                          disabled={u.is_super_admin}
                          className={`p-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            u.account_status === 'Active' || (u.account_status as string) === 'ACTIVE'
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title={u.account_status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {u.account_status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={u.is_super_admin || u.username === 'admin'}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 rounded-lg disabled:opacity-40 cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CREATE USER FROM HRM */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-600" /> Cấp Tài Khoản Mới Từ Nhân Sự HRM
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Chọn Nhân Sự Từ HRM *</label>
                <select
                  value={selectedHrmEmp}
                  onChange={(e) => setSelectedHrmEmp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
                >
                  <option value="NV-00108">[NV-00108] Phạm Minh Đức - Giám Đốc Kinh Doanh</option>
                  <option value="NV-00109">[NV-00109] Vũ Nam Khánh - Chuyên Viên Vận Hành TMĐT</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Tên Đăng Nhập *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: duc.pm"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Mật Khẩu Khởi Tạo *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu..."
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Vai Trò Phân Quyền (RBAC) *</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg cursor-pointer"
                >
                  Cấp Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER ACCOUNT */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-600" /> Chỉnh Sửa Tài Khoản: {selectedUser.username}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Tên Nhân Viên *</label>
                <input
                  type="text"
                  required
                  value={formEmployeeName}
                  onChange={(e) => setFormEmployeeName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Email Công Ty *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Vai Trò Phân Quyền (RBAC) *</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Trạng Thái Tài Khoản *</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  <option value="Active">🟢 Hoạt Động (Active)</option>
                  <option value="Locked">🔒 Bị Khóa (Locked)</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg cursor-pointer"
                >
                  <Save className="w-4 h-4 inline mr-1" /> Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADMIN RESET PASSWORD */}
      {isResetPassModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" /> Admin Reset Mật Khẩu User
              </h3>
              <button onClick={() => setIsResetPassModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdminResetPassSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-300">
                Reset mật khẩu cho tài khoản: <strong>{selectedUser.username}</strong> ({selectedUser.employee_name})
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Mật khẩu mới (tối thiểu 6 ký tự) *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập mật khẩu mới..."
                  value={adminResetPass}
                  onChange={(e) => setAdminResetPass(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700 font-medium"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsResetPassModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg cursor-pointer"
                >
                  🔑 Reset Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW USER DETAIL */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" /> Chi Tiết Hồ Sơ Tài Khoản
              </h3>
              <button onClick={() => setIsViewModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{selectedUser.employee_name}</span>
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 font-mono text-[10.5px] rounded-full font-semibold">
                    {selectedUser.employee_code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 font-medium text-[11.5px] pt-2 border-t">
                  <p>
                    Tên đăng nhập: <strong className="text-slate-900 dark:text-slate-100 font-mono">{selectedUser.username}</strong>
                  </p>
                  <p>
                    Email: <strong className="text-slate-900 dark:text-slate-100 font-mono">{selectedUser.email}</strong>
                  </p>
                  <p>
                    Vai trò: <strong className="text-purple-700 dark:text-purple-400">{selectedUser.role_name}</strong>
                  </p>
                  <p>
                    Trạng thái 2FA:{' '}
                    <strong className={selectedUser.is_2fa_enabled ? 'text-emerald-600' : 'text-slate-400'}>
                      {selectedUser.is_2fa_enabled ? '🟢 Đã Bật 2FA' : '⚪ Chưa Bật 2FA'}
                    </strong>
                  </p>
                  <p>
                    Đăng nhập cuối:{' '}
                    <strong className="text-slate-900 dark:text-slate-100">{selectedUser.last_login_at || 'Mới khởi tạo'}</strong>
                  </p>
                  <p>
                    Ngày tạo: <strong className="text-slate-900 dark:text-slate-100 font-mono">{selectedUser.created_at}</strong>
                  </p>
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-1">
                <p className="text-purple-900 dark:text-purple-300 font-semibold uppercase text-[10.5px]">
                  Quyền Hạn RBAC Được Cấp:
                </p>
                <p className="text-purple-800 dark:text-purple-400 font-mono text-[11px]">
                  {selectedUser.permissions ? selectedUser.permissions.join(', ') : 'Mặc định theo Vai Trò'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end pt-3 border-t">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-medium cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
