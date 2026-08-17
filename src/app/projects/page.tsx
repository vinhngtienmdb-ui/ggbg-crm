'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  User,
  Building2,
  Clock,
  ChevronRight,
  BarChart3,
  Layers,
  X
} from 'lucide-react';
import { EnterpriseProject, ProjectTask, ProjectStatus } from '@/types';
import {
  getEnterpriseProjects,
  addEnterpriseProject,
  updateEnterpriseProject,
  deleteEnterpriseProject
} from '@/lib/erpStore';
import { formatCurrency } from '@/lib/formatters';

export default function EnterpriseProjectsPage() {
  const [projects, setProjects] = useState<EnterpriseProject[]>(() => getEnterpriseProjects());
  const [viewMode, setViewMode] = useState<'GANTT' | 'KANBAN' | 'CONFIG'>('GANTT');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Project Config State
  const [prjConfig, setPrjConfig] = useState({
    overbudget_warning_pct: 90,
    max_workload_pct: 120,
    default_currency: 'VND',
    auto_archive_days: 30,
  });

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<EnterpriseProject | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    client_name: 'Công Ty TNHH Mỹ Phẩm An An',
    department: 'Khối Kinh Doanh & TMĐT',
    manager_name: 'Đặng Tuấn Tú',
    start_date: '2026-08-01',
    end_date: '2026-10-30',
    budget: 150000000,
    description: '',
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Vũ Quốc Anh');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prj: EnterpriseProject = {
      id: `prj_${Date.now()}`,
      project_code: `DA-2026-${String(projects.length + 1).padStart(3, '0')}`,
      name: newProject.name,
      client_name: newProject.client_name,
      department: newProject.department,
      manager_name: newProject.manager_name,
      start_date: newProject.start_date,
      end_date: newProject.end_date,
      budget: Number(newProject.budget),
      actual_cost: 0,
      progress_pct: 0,
      status: 'PLANNING',
      description: newProject.description,
      tasks: [],
    };

    const updated = addEnterpriseProject(prj);
    setProjects([...updated]);
    setIsCreateOpen(false);
    showToast(` Đã khởi tạo Dự án mới: ${prj.name}`);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newTaskTitle) return;

    const task: ProjectTask = {
      id: `tk_${Date.now()}`,
      project_id: selectedProject.id,
      title: newTaskTitle,
      assignee_name: newTaskAssignee,
      start_date: '2026-08-01',
      due_date: '2026-08-15',
      progress_pct: 0,
      status: 'TODO',
    };

    const updatedPrj = {
      ...selectedProject,
      tasks: [...selectedProject.tasks, task],
    };

    const updated = updateEnterpriseProject(updatedPrj);
    setProjects([...updated]);
    setSelectedProject(updatedPrj);
    setNewTaskTitle('');
    setIsAddTaskOpen(false);
    showToast(`⚡ Đã bổ sung hạng mục công việc: ${task.title}`);
  };

  const handleDelete = (id: string) => {
    const updated = deleteEnterpriseProject(id);
    setProjects([...updated]);
    showToast('🗑 Đã xóa dự án khỏi hệ thống');
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchTerm.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.project_code.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
  });

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalActual = projects.reduce((sum, p) => sum + p.actual_cost, 0);
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress_pct, 0) / (projects.length || 1));

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"> <Sparkles className="w-4 h-4 text-blue-400" /> {toastMsg} </div> )}

      {/* Header - Clean White with Colorful Highlights */} <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400"> <FolderKanban className="w-5 h-5" /> </div> <div> <div className="flex items-center gap-2"> <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"> Bàn Làm Việc Dự Án </h1> <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-medium border border-purple-200 dark:border-purple-800"> {projects.length} Dự Án </span> </div> <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5"> Theo dõi tiến độ dự án Gantt Chart, mốc thời gian Milestone & chi phí ngân sách </p> </div> </div> <div className="flex items-center gap-2 flex-wrap"> <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center gap-1 text-xs font-medium border border-slate-200 dark:border-slate-700"> <button
              onClick={() => setViewMode('GANTT')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'GANTT' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            > Gantt Chart </button> <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'KANBAN' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            > Kanban </button> <button
              onClick={() => setViewMode('CONFIG')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'CONFIG' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            > Cấu Hình </button> </div> <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
          > <Plus className="w-4 h-4" /> + Khởi Tạo Dự Án </button> </div> </div> {/* KPI Cards */} <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium"> <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1"> <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Tổng Số Dự Án</span> <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{projects.length} Dự Án</p> <p className="text-purple-600 dark:text-purple-400 text-[11px]">{projects.filter(p => p.status === 'IN_PROGRESS').length} Đang thực hiện</p> </div> <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1"> <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Tiến Độ Trung Bình</span> <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{avgProgress}%</p> <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1"> <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avgProgress}%` }}></div> </div> </div> <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1"> <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Tổng Ngân Sách Dự Án</span> <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(totalBudget)}</p> <p className="text-blue-600 dark:text-blue-400 text-[11px]">Hạn mức đầu tư phê duyệt</p> </div> <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1"> <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Chi Phí Thực Tế</span> <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(totalActual)}</p> <p className="text-amber-600 dark:text-amber-400 text-[11px]">Kiểm soát giải ngân</p> </div> </div> {/* GANTT CHART VIEW */}
      {viewMode === 'GANTT' && ( <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-medium"> <div className="flex items-center justify-between border-b pb-4"> <div className="flex items-center gap-2"> <BarChart3 className="w-5 h-5 text-purple-600" /> <h3 className="font-semibold text-sm text-slate-900">Sơ Đồ Tiến Độ Timeline Gantt Chart</h3> </div> <span className="text-slate-500">Timeline: Tháng 07/2026 — Tháng 11/2026</span> </div> <div className="space-y-6"> {filteredProjects.map((prj) => ( <div key={prj.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-200/80 pb-3"> <div> <div className="flex items-center gap-2"> <span className="font-mono text-purple-700 font-semibold text-xs">{prj.project_code}</span> <h4 className="font-semibold text-slate-900 text-sm">{prj.name}</h4> <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        prj.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        prj.status === 'PLANNING' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800'
                      }`}> {prj.status === 'IN_PROGRESS' ? '🔵 Đang Thực Hiện' : prj.status === 'PLANNING' ? '🟡 Lập Kế Hoạch' : '🟢 Hoàn Thành'} </span> </div> <p className="text-[11px] text-slate-500 font-normal mt-0.5"> Khách hàng: <strong>{prj.client_name || 'Internal'}</strong> • Trưởng dự án: <strong>{prj.manager_name}</strong> ({prj.department}) </p> </div> <div className="flex items-center gap-3"> <div className="text-right"> <span className="text-[10.5px] text-slate-500 block">Ngân sách vs Thực tế:</span> <span className="font-mono text-xs text-slate-900 font-semibold"> {formatCurrency(prj.actual_cost)} / {formatCurrency(prj.budget)} </span> </div> <button
                      onClick={() => {
                        setSelectedProject(prj);
                        setIsAddTaskOpen(true);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all"
                    > <Plus className="w-3.5 h-3.5" /> Thêm Task </button> <button
                      onClick={() => handleDelete(prj.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      title="Xóa Dự Án"
                    > <Trash2 className="w-4 h-4" /> </button> </div> </div> {/* Progress Bar Timeline */} <div className="space-y-1.5"> <div className="flex justify-between text-xs text-slate-700"> <span>Thời gian: {prj.start_date} ➔ {prj.end_date}</span> <span className="font-mono font-semibold text-purple-700">{prj.progress_pct}% Hoàn Thành</span> </div> <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden"> <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${prj.progress_pct}%` }}
                    ></div> </div> </div> {/* Sub-tasks list */}
                {prj.tasks.length > 0 && ( <div className="pt-2 space-y-2"> <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Các Hạng Mục Công Việc trực thuộc ({prj.tasks.length} Task):</span> <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> {prj.tasks.map((t) => ( <div key={t.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"> <div> <p className="font-medium text-slate-900">{t.title}</p> <p className="text-[10.5px] text-slate-500">👤 {t.assignee_name} • Hạn: {t.due_date}</p> </div> <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.status === 'DONE' ? 'bg-emerald-100 text-emerald-800' :
                            t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                          }`}> {t.status === 'DONE' ? ' Finished' : t.status === 'IN_PROGRESS' ? '🔵 Doing' : '⚪ Todo'} </span> </div> ))} </div> </div> )} </div> ))} </div> </div> )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'KANBAN' && ( <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium"> {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((colStatus) => {
            const statusNames: Record<string, string> = {
              TODO: '📋 Cần Làm (Todo)',
              IN_PROGRESS: '🔵 Đang Thực Hiện (Doing)',
              REVIEW: '🟡 Chờ Nghiệm Thu (Review)',
              DONE: ' Hoàn Thành (Done)',
            };

            const allTasks = projects.flatMap(p => p.tasks).filter(t => t.status === colStatus);

            return ( <div key={colStatus} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 min-h-[400px]"> <div className="flex items-center justify-between border-b pb-2"> <span className="font-semibold text-slate-900 text-xs">{statusNames[colStatus]}</span> <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full font-mono text-[10.5px]"> {allTasks.length} </span> </div> <div className="space-y-2"> {allTasks.map((t) => ( <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5 hover:shadow-md transition-all"> <p className="font-semibold text-slate-900">{t.title}</p> <p className="text-[11px] text-slate-500 font-normal">👤 Phụ trách: <strong>{t.assignee_name}</strong></p> <div className="flex items-center justify-between text-[10.5px] pt-1 border-t border-slate-100"> <span className="text-slate-400 font-mono">📅 {t.due_date}</span> <span className="font-mono text-purple-700 font-medium">{t.progress_pct}%</span> </div> </div> ))} </div> </div> );
          })} </div> )}

      {/* CONFIGURATION VIEW */}
      {viewMode === 'CONFIG' && ( <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-medium"> <div className="flex items-center justify-between border-b pb-3"> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <FolderKanban className="w-5 h-5 text-purple-600" /> Cấu Hình Tham Số Vận Hành Dự Án Enterprise </h3> <p className="text-[11px] text-slate-500 font-normal mt-0.5"> Thiết lập ngưỡng cảnh báo vọt ngân sách dự án, tải công việc nhân sự quá tải & lưu trữ tự động. </p> </div> <button
              onClick={() => showToast('💾 Đã lưu thành công cấu hình tham số Quản lý Dự án!')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
            > <FolderKanban className="w-4 h-4" /> Lưu Cấu Hình Dự Án </button> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <h4 className="font-semibold text-slate-900 text-xs text-purple-700 uppercase tracking-wider"> 1. Ngưỡng Cảnh Báo Ngân Sách & Tải Công Việc </h4> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-700 mb-1">Cảnh Báo Vọt Ngân Sách (%) *</label> <input
                    type="number"
                    value={prjConfig.overbudget_warning_pct}
                    onChange={(e) => setPrjConfig({ ...prjConfig, overbudget_warning_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700"
                  /> </div> <div> <label className="block text-slate-700 mb-1">Giới Hạn Tải Nhân Sự (%) *</label> <input
                    type="number"
                    value={prjConfig.max_workload_pct}
                    onChange={(e) => setPrjConfig({ ...prjConfig, max_workload_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700"
                  /> </div> </div> </div> <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <h4 className="font-semibold text-slate-900 text-xs text-purple-700 uppercase tracking-wider"> 2. Quy Tắc Lưu Trữ & Đơn Vị Tiền Tệ </h4> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-700 mb-1">Đơn Vị Tiền Tệ *</label> <select
                    value={prjConfig.default_currency}
                    onChange={(e) => setPrjConfig({ ...prjConfig, default_currency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  > <option value="VND">VND (Việt Nam Đồng)</option> <option value="USD">USD (Đô La Mỹ)</option> </select> </div> <div> <label className="block text-slate-700 mb-1">Tự Động Lưu Trữ (Ngày) *</label> <input
                    type="number"
                    value={prjConfig.auto_archive_days}
                    onChange={(e) => setPrjConfig({ ...prjConfig, auto_archive_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-slate-800"
                  /> </div> </div> </div> </div> </div> )}

      {/* MODAL KHỞI TẠO DỰ ÁN MỚI */}
      {isCreateOpen && ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200"> <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-medium"> <div className="flex items-center justify-between border-b pb-3"> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <FolderKanban className="w-5 h-5 text-purple-600" /> Khởi Tạo Dự Án Mới (Enterprise Project) </h3> <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700"> <X className="w-5 h-5" /> </button> </div> <form onSubmit={handleCreateSubmit} className="space-y-3"> <div> <label className="block text-slate-700 mb-1">Tên Dự Án Enterprise *</label> <input
                  type="text"
                  required
                  placeholder="Ví dụ: Setup Hệ Thống Gian Hàng Agency..."
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                /> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-700 mb-1">Tên Khách Hàng / Đối Tác</label> <input
                    type="text"
                    value={newProject.client_name}
                    onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  /> </div> <div> <label className="block text-slate-700 mb-1">Quản Lý Dự Án (PM) *</label> <input
                    type="text"
                    required
                    value={newProject.manager_name}
                    onChange={(e) => setNewProject({ ...newProject, manager_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  /> </div> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-700 mb-1">Ngày Bắt Đầu *</label> <input
                    type="date"
                    required
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  /> </div> <div> <label className="block text-slate-700 mb-1">Ngày Dự Kiến Kết Thúc *</label> <input
                    type="date"
                    required
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  /> </div> </div> <div> <label className="block text-slate-700 mb-1">Tổng Ngân Sách Dự Kiến (VND) *</label> <input
                  type="number"
                  step={5000000}
                  required
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700"
                /> </div> <div> <label className="block text-slate-700 mb-1">Mô Tả Mục Tiêu Dự Án</label> <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                /> </div> <div className="flex items-center justify-end gap-3 pt-3 border-t"> <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                > Hủy </button> <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30"
                > Khởi Tạo Dự Án </button> </div> </form> </div> </div> )}

      {/* MODAL THÊM TASK CHO DỰ ÁN */}
      {isAddTaskOpen && selectedProject && ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200"> <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-4 text-xs font-medium"> <div className="flex items-center justify-between border-b pb-3"> <h3 className="font-semibold text-sm text-slate-900">Bổ Sung Task: {selectedProject.name}</h3> <button onClick={() => setIsAddTaskOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700"> <X className="w-5 h-5" /> </button> </div> <form onSubmit={handleAddTaskSubmit} className="space-y-3"> <div> <label className="block text-slate-700 mb-1">Tên Hạng Mục Công Việc *</label> <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thiết kế Banner, Đăng ký Flash Sale..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                /> </div> <div> <label className="block text-slate-700 mb-1">Nhân Sự Phụ Trách *</label> <input
                  type="text"
                  required
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                /> </div> <div className="flex items-center justify-end gap-3 pt-3 border-t"> <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                > Hủy </button> <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30"
                > Bổ Sung Task </button> </div> </form> </div> </div> )} </div> );
}
