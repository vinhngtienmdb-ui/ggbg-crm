'use client';

import React, { useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, UserCheck, X, Play, Download, Building2 } from 'lucide-react';

interface VoIPCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName?: string;
  targetPhone?: string;
}

export default function VoIPCallModal({ isOpen, onClose, targetName = 'Nguyễn Văn Hùng (Shopee Mall)', targetPhone = '0988 123 456' }: VoIPCallModalProps) {
  const [callState, setCallState] = useState<'IDLE' | 'DIALING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [duration, setDuration] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(targetPhone);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  const handleStartCall = () => {
    setCallState('DIALING');
    setTimeout(() => {
      setCallState('CONNECTED');
    }, 2000);
  };

  const handleEndCall = () => {
    setCallState('ENDED');
    setTimeout(() => {
      setCallState('IDLE');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="font-bold text-sm">Tổng Đài VoIP GGBingo (Cloud Call)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-2xl shadow-inner">
            {targetName ? targetName.charAt(0) : 'KH'}
          </div>

          <h4 className="font-bold text-slate-900 text-lg">{targetName || 'Khách Hàng Mới'}</h4>
          <p className="text-slate-500 font-mono text-sm mb-2">{phoneNumber}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium mb-6">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Gian hàng Shopee & TikTok Service
          </div>

          {/* Call Status Display */}
          {callState === 'IDLE' && (
            <div className="space-y-4">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập SĐT cần gọi..."
                className="w-full px-4 py-2.5 text-center font-mono text-lg bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleStartCall}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Phone className="w-5 h-5 fill-white" />
                Bắt Đầu Cuộc Gọi VoIP
              </button>
            </div>
          )}

          {callState === 'DIALING' && (
            <div className="py-4">
              <div className="text-blue-600 font-semibold text-sm animate-pulse mb-4">Đang kết nối tổng đài...</div>
              <button
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          )}

          {callState === 'CONNECTED' && (
            <div className="py-2 space-y-5">
              <div className="text-emerald-600 font-mono font-bold text-2xl tracking-wider animate-pulse">
                00:14
              </div>
              <p className="text-xs text-slate-400">Đang ghi âm cuộc gọi và đồng bộ Cloudflare R2</p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full border transition-all ${
                    isMuted ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleEndCall}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 active:scale-95"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
                <button className="p-3 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200">
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {callState === 'ENDED' && (
            <div className="py-3 text-slate-600">
              <p className="font-semibold text-emerald-600 mb-1">Cuộc gọi đã hoàn tất (45 giây)</p>
              <p className="text-xs text-slate-400">File ghi âm đã lưu: <span className="font-mono text-blue-600">r2.ggbingo.vn/call_10293.mp3</span></p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center flex items-center justify-between px-4">
          <span>Trạng thái: Stringee WebRTC OK</span>
          <span>Tự động cập nhật CRM History</span>
        </div>
      </div>
    </div>
  );
}
