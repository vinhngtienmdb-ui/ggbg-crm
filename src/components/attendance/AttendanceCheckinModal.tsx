'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  RefreshCw,
  Building2,
  Globe,
  ShieldCheck,
  User,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  Calendar,
  Lock,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { EmployeeProfile, WorkShift, HolidayDefinition, WeekendPolicySettings } from '@/types';
import {
  getEmployees,
  getWorkShifts,
  getHolidays,
  getWeekendPolicy,
  getShiftAssignments
} from '@/lib/hrmStore';
import {
  recordCheckIn,
  recordCheckOut,
  getAttendance,
  getPeriodLockStatus
} from '@/lib/payrollStore';

interface AttendanceCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultEmployeeId?: string;
}

// Haversine distance in meters
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export default function AttendanceCheckinModal({
  isOpen,
  onClose,
  onSuccess,
  defaultEmployeeId,
}: AttendanceCheckinModalProps) {
  const employees = getEmployees();
  const workShifts = getWorkShifts();
  const weekendPolicy = getWeekendPolicy();
  const holidays = getHolidays();

  const [selectedEmpId, setSelectedEmpId] = useState<string>(defaultEmployeeId || employees[0]?.id || '');

  // Time & date
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toTimeString().slice(0, 5));
  const [todayDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // GPS State
  const [gpsLoading, setGpsLoading] = useState<boolean>(true);
  const [userLat, setUserLat] = useState<number>(21.03472);
  const [userLng, setUserLng] = useState<number>(105.78306);
  const [distanceToOffice, setDistanceToOffice] = useState<number>(42);
  const [isOutsideOffice, setIsOutsideOffice] = useState<boolean>(false);
  const [outsideReason, setOutsideReason] = useState<string>('');

  // Camera Face Capture State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Selected Employee & Fixed Shift Assignment
  const selectedEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  // Lookup today's assigned shift for this employee (enforce fixed assignment)
  const shiftAssignments = getShiftAssignments();
  const assignedShiftObj = shiftAssignments.find(
    (a) => a.employee_id === selectedEmpId && a.date === todayDate
  );
  const effectiveShiftId = assignedShiftObj?.shift_id || selectedEmp?.default_shift_id || 'shift_office';
  const assignedShift = workShifts.find((s) => s.id === effectiveShiftId) || workShifts[0];

  // Lookup today's attendance record for this employee to enforce sequential Check-in -> Check-out
  const attendanceList = getAttendance();
  const todayRecord = attendanceList.find(
    (a) => a.employee_id === selectedEmpId && a.date === todayDate
  );
  const hasCheckedIn = !!todayRecord?.check_in_time;
  const hasCheckedOut = !!todayRecord?.check_out_time;

  // Check Holiday / Weekend
  const todayHoliday = holidays.find((h) => h.date === todayDate);
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Check Period Lock
  const currentPeriod = 'Tháng 07/2026';
  const lockStatus = getPeriodLockStatus(currentPeriod);

  // Set default employee when prop changes
  useEffect(() => {
    if (defaultEmployeeId) {
      setSelectedEmpId(defaultEmployeeId);
    }
  }, [defaultEmployeeId]);

  // Realtime clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Geolocation
  useEffect(() => {
    if (!isOpen) return;

    if ('geolocation' in navigator) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLat(lat);
          setUserLng(lng);

          const dist = calculateDistanceMeters(
            lat,
            lng,
            weekendPolicy.office_lat,
            weekendPolicy.office_lng
          );
          setDistanceToOffice(dist);
          const outside = dist > weekendPolicy.office_radius_meters;
          setIsOutsideOffice(outside);
          setGpsLoading(false);
        },
        (err) => {
          // Fallback simulation (inside office)
          setUserLat(weekendPolicy.office_lat);
          setUserLng(weekendPolicy.office_lng);
          setDistanceToOffice(35);
          setIsOutsideOffice(false);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setDistanceToOffice(45);
      setIsOutsideOffice(false);
      setGpsLoading(false);
    }
  }, [isOpen, weekendPolicy]);

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Không thể mở trực tiếp Camera thiết bị. Vui lòng bấm chụp ảnh mô phỏng xác thực.');
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && !hasCheckedOut) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPhoto(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, hasCheckedOut]);

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(dataUrl);
      }
    } else {
      // Simulation placeholder
      setCapturedPhoto('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%232563eb"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>');
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    if (!cameraActive) {
      startCamera();
    }
  };

  // Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    if (lockStatus.is_locked) {
      alert('Kỳ chấm công này đã được chốt và khóa sổ. Không thể thực hiện chấm công bổ sung.');
      return;
    }

    const locationType = isOutsideOffice ? 'OUTSIDE_REMOTE' : 'OFFICE';
    const gpsData = {
      latitude: userLat,
      longitude: userLng,
      address_name: isOutsideOffice ? 'Vị trí ngoài văn phòng' : weekendPolicy.office_address,
      distance_meters: distanceToOffice,
    };

    if (!hasCheckedIn) {
      // 1. Check-in
      recordCheckIn(selectedEmp.id, {
        checkInTime: currentTime,
        shiftId: assignedShift.id,
        shiftName: assignedShift.name,
        shiftStartTime: assignedShift.start_time,
        shiftEndTime: assignedShift.end_time,
        locationType,
        gps: gpsData,
        faceImage: capturedPhoto || undefined,
        outsideReason: isOutsideOffice ? outsideReason : undefined,
        isHoliday: !!todayHoliday,
        holidayName: todayHoliday?.name,
        isWeekend,
        payMultiplier: todayHoliday ? 3.0 : isWeekend ? 2.0 : 1.0,
      });
    } else if (hasCheckedIn && !hasCheckedOut) {
      // 2. Check-out
      recordCheckOut(selectedEmp.id, {
        checkOutTime: currentTime,
        locationType,
        gps: gpsData,
        faceImage: capturedPhoto || undefined,
        outsideReason: isOutsideOffice ? outsideReason : undefined,
      });
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className={`p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between ${
          !hasCheckedIn
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-900'
            : !hasCheckedOut
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900'
            : 'bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl text-white flex items-center justify-center shadow-md ${
              !hasCheckedIn ? 'bg-emerald-600 shadow-emerald-500/20' : !hasCheckedOut ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-blue-600'
            }`}>
              {!hasCheckedIn ? <Sun className="w-6 h-6" /> : !hasCheckedOut ? <Moon className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                {!hasCheckedIn
                  ? '🟢 Check-in Vào Ca Làm Việc (Camera Face ID & GPS)'
                  : !hasCheckedOut
                  ? '🟣 Check-out Tan Ca Làm Việc (Camera Face ID & GPS)'
                  : '🎉 Đã Hoàn Thành Ca Làm Việc Hôm Nay'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {!hasCheckedIn
                  ? 'Xác thực khuôn mặt và tọa độ vị trí để bắt đầu tính giờ công'
                  : !hasCheckedOut
                  ? `Đã vào ca lúc ${todayRecord?.check_in_time} • Bấm để chốt giờ tan ca và tính OT`
                  : 'Bạn đã hoàn tất cả 2 lượt Check-in và Check-out trong ngày'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Warning if period is locked */}
        {lockStatus.is_locked && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              🔒 <strong>Kỳ chấm công {currentPeriod} đã được Chốt và Khóa Sổ</strong> bởi {lockStatus.locked_by}. Không thể thực hiện chấm công hoặc sửa đổi bảng công.
            </span>
          </div>
        )}

        {/* COMPLETED SCREEN (if both in & out are done) */}
        {hasCheckedIn && hasCheckedOut ? (
          <div className="p-8 space-y-5 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {selectedEmp.full_name} đã hoàn thành ca hôm nay
              </h4>
              <p className="text-xs text-slate-500">
                Ca làm việc: <strong className="text-slate-700 dark:text-slate-300">{assignedShift.name}</strong>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-md p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
              <div>
                <span className="text-slate-500 text-[10px] block">Giờ Vào Ca</span>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300 text-sm">
                  {todayRecord.check_in_time}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Giờ Tan Ca</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                  {todayRecord.check_out_time}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Tăng Ca (OT)</span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300 text-sm">
                  +{todayRecord.ot_hours || 0}h
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        ) : (
          /* FORM BODY */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
            {/* Step 1: Employee Picker & Sequential Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Nhân Viên Thực Hiện *</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_code}) - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Trạng Thái Thao Tác Tuần Tự</label>
                <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  {!hasCheckedIn ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg font-bold text-xs flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5" /> 1. Chờ Check-in (Vào Ca)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded-lg font-bold text-xs flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5" /> 2. Chờ Check-out (Tan Ca)
                    </span>
                  )}
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {currentTime} ({todayDate})
                  </span>
                </div>
              </div>
            </div>

            {/* FIXED SHIFT ENFORCEMENT CARD (Nhân viên không được chọn tùy ý) */}
            <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-blue-600" /> Ca Làm Việc Được Phân Công:
                </span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-md font-semibold text-[10px] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-blue-600" /> Ca Cố Định (Hệ Thống Phân Công)
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="font-bold text-blue-950 dark:text-blue-200 text-sm block">
                    {assignedShift.name} ({assignedShift.shift_code})
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Khung giờ: <strong>{assignedShift.start_time} - {assignedShift.end_time}</strong> (Nghỉ giữa ca: {assignedShift.break_start || '12:00'} - {assignedShift.break_end || '13:30'})
                  </span>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <span>Thời gian ân hạn: <strong>{assignedShift.grace_period_late_mins || 15} phút</strong></span>
                </div>
              </div>
            </div>

            {/* If has checked in already, show check-in summary callout */}
            {hasCheckedIn && !hasCheckedOut && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between text-xs text-indigo-950 dark:text-indigo-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Bạn đã Check-in lúc: <strong className="font-mono font-bold">{todayRecord?.check_in_time}</strong>
                </span>
                <span className="text-[11px] text-slate-500">
                  Thực hiện Check-out để hoàn tất và ghi nhận giờ làm việc
                </span>
              </div>
            )}

            {/* Holiday / Weekend Banner */}
            {(todayHoliday || isWeekend) && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-xl text-xs flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {todayHoliday ? (
                    <>
                      🎉 <strong>Hôm nay là {todayHoliday.name}</strong> • Đi làm ca này sẽ được tính hệ số tiền lương <strong>x300% (x3.0)</strong> theo Luật Lao Động.
                    </>
                  ) : (
                    <>
                      🏖️ <strong>Hôm nay là Ngày Nghỉ Cuối Tuần</strong> • Đi làm ca này sẽ được tính hệ số tăng ca <strong>x200% (x2.0)</strong>.
                    </>
                  )}
                </span>
              </div>
            )}

            {/* CAMERA FACE CAPTURE SECTION */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-blue-600" /> Xác Thực Khuôn Mặt (Camera Live Face Capture)
                </span>
                {capturedPhoto && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã Xác Thực Gương Mặt
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                {/* Video or Captured Image */}
                <div className="relative w-48 h-36 bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-inner">
                  {capturedPhoto ? (
                    <img src={capturedPhoto} alt="Captured face" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      <div className="absolute inset-2 border-2 border-dashed border-white/60 rounded-full pointer-events-none opacity-60"></div>
                    </>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Vui lòng giữ khuôn mặt nằm trong khung oval và bấm chụp để xác thực chấm công chống gian lận.
                  </p>
                  {!capturedPhoto ? (
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all mx-auto sm:mx-0"
                    >
                      <Camera className="w-3.5 h-3.5" /> Chụp Ảnh Xác Thực
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRetakePhoto}
                      className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-xl text-xs flex items-center gap-1 mx-auto sm:mx-0"
                    >
                      <RefreshCw className="w-3 h-3" /> Chụp Lại Ảnh
                    </button>
                  )}
                  {cameraError && <p className="text-[10px] text-amber-600 italic">{cameraError}</p>}
                </div>
              </div>
            </div>

            {/* GPS GEOLOCATION & OUTSIDE OFFICE SECTION */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Định Vị Tọa Độ GPS & Bán Kính Văn Phòng
                </span>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOutsideOffice}
                    onChange={(e) => setIsOutsideOffice(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Chấm công ngoài văn phòng / Remote</span>
                </label>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Trạng Thái Vị Trí:</span>
                  {isOutsideOffice ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-semibold rounded-md flex items-center gap-1">
                      <Globe className="w-3 h-3 text-amber-600" /> Ngoài Văn Phòng (Khoảng cách: {distanceToOffice}m)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold rounded-md flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-600" /> Tại Văn Phòng (Hợp Lệ - Cách {distanceToOffice}m)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Tọa độ GPS: {userLat.toFixed(5)}, {userLng.toFixed(5)} • Trụ sở: {weekendPolicy.office_address}
                </p>
              </div>

              {/* If outside office, require reason */}
              {isOutsideOffice && (
                <div className="space-y-1 animate-in fade-in">
                  <label className="block text-slate-700 dark:text-slate-300 font-medium">
                    Lý Do Làm Việc Ngoài Văn Phòng / Khách Hàng / Công Tác *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Đi gặp đối tác khách hàng tại Aeon Mall Hà Đông / WFH theo phê duyệt..."
                    value={outsideReason}
                    onChange={(e) => setOutsideReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-xl font-medium"
                  />
                </div>
              )}
            </div>

            {/* Footer Controls (Only Check-in or Check-out is shown) */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900 -mx-6 -mb-6 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={lockStatus.is_locked}
                className={`px-5 py-2 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
                  lockStatus.is_locked
                    ? 'bg-slate-400 cursor-not-allowed'
                    : !hasCheckedIn
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {!hasCheckedIn ? 'Xác Nhận Check-in Vào Ca' : 'Xác Nhận Check-out Tan Ca'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
