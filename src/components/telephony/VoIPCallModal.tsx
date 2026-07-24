'use client';

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, X, Play, Download, Building2, FileText, CheckCircle2 } from 'lucide-react';

interface VoIPCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName?: string;
  targetPhone?: string;
}

export default function VoIPCallModal({
  isOpen,
  onClose,
  targetName = 'Nguyễn Văn Hùng (Shopee Mall)',
  targetPhone = '0988 123 456'
}: VoIPCallModalProps) {
  const [callState, setCallState] = useState<'IDLE' | 'DIALING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [seconds, setSeconds] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(targetPhone);
  const [isMuted, setIsMuted] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'CONNECTED') {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setCallState('DIALING');
    setTimeout(() => {
      setCallState('CONNECTED');
      setSpeechTranscript('Khách hàng quan tâm đến gói Vận hành Trọn gói Shopee Mall & Livestream TikTok. Hẹn gửi Báo giá chi tiết chiều nay.');
    }, 1800);
  };

  const handleEndCall = () => {
    setCallState('ENDED');
    setTimeout(() => {
      setCallState('IDLE');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">Tổng Đài VoIP WebRTC GGBingo</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center">
          <div className="w-16 h-16 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-3 text-blue-700 font-bold text-xl shadow-2xs">
            {targetName ? targetName.charAt(0) : 'KH'}
          </div>

          <h4 className="font-bold text-slate-900 text-base">{targetName || 'Khách Hàng Mới'}</h4>
          <p className="text-slate-500 font-mono text-xs mb-2">{phoneNumber}</p>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px] font-medium mb-4">
            <Building2 className="w-3 h-3 text-slate-500" />
            Vận hành Shopee & TikTok Service
          </div>

          {/* Call Status Display */}
          {callState === 'IDLE' && (
            <div className="space-y-3">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập SĐT cần gọi..."
                className="w-full px-3 py-2 text-center font-mono text-base bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                onClick={handleStartCall}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95 text-xs"
              >
                <Phone className="w-4 h-4 fill-white" />
                Click-to-Call VoIP Ngay
              </button>
            </div>
          )}

          {callState === 'DIALING' && (
            <div className="py-4">
              <div className="text-blue-600 font-semibold text-xs animate-pulse mb-4">Đang kết nối cổng WebRTC...</div>
              <button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center mx-auto shadow-md"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          )}

          {callState === 'CONNECTED' && (
            <div className="py-2 space-y-4">
              <div className="text-emerald-600 font-mono font-bold text-3xl tabular-numbers">
                {formatTimer(seconds)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Đang kết nối thời gian thực & ghi âm Cloudflare R2</p>

              {/* Speech-to-Text Live Transcript */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-left text-[11px] space-y-1">
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" /> Bóc tách lời thoại (Speech-to-Text):
                </p>
                <p className="text-slate-600 italic leading-relaxed">"{speechTranscript}"</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-md border transition-colors ${
                    isMuted ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                  title="Tắt/Mở Micro"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md active:scale-95"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {callState === 'ENDED' && (
            <div className="py-3 text-slate-600 space-y-1">
              <p className="font-bold text-emerald-600 text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Đã hoàn tất cuộc gọi & lưu nhật ký
              </p>
              <p className="text-[11px] text-slate-400 font-mono">File ghi âm: r2.ggbingo.vn/call_voip_2026.mp3</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between px-3">
          <span>WebRTC Core: Ready 100%</span>
          <span>Đồng bộ CRM History</span>
        </div>
      </div>
    </div>
  );
}
