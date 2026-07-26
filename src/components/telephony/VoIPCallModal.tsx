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
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-cardLg border border-line w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-3.5 bg-brand-50 text-brand-800 flex items-center justify-between border-b border-line">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-dot animate-pulse"></span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink-400">Tổng Đài VoIP WebRTC GGBingo</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-ink-400 hover:text-brand-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center">
          <div className="w-16 h-16 rounded-md bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-3 text-brand-800 font-bold text-xl">
            {targetName ? targetName.charAt(0) : 'KH'}
          </div>

          <h4 className="font-bold text-ink-900 text-base">{targetName || 'Khách Hàng Mới'}</h4>
          <p className="text-ink-500 font-mono text-xs mb-2">{phoneNumber}</p>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-line-soft text-ink-700 rounded border border-line text-[11px] font-medium mb-4">
            <Building2 className="w-3 h-3 text-ink-500" />
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
                className="w-full px-3 py-2 text-center font-mono text-base bg-surface-subtle border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-success-fg/20"
              />
              <button
                onClick={handleStartCall}
                className="w-full py-2.5 bg-success-fg hover:bg-success-deep text-white font-bold rounded-md flex items-center justify-center gap-2 transition-colors active:scale-95 text-xs"
              >
                <Phone className="w-4 h-4 fill-white" />
                Click-to-Call VoIP Ngay
              </button>
            </div>
          )}

          {callState === 'DIALING' && (
            <div className="py-4">
              <div className="text-brand-600 font-semibold text-xs animate-pulse mb-4">Đang kết nối cổng WebRTC...</div>
              <button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-danger-fg hover:bg-danger-deep text-white flex items-center justify-center mx-auto shadow-md"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          )}

          {callState === 'CONNECTED' && (
            <div className="py-2 space-y-4">
              <div className="text-success-fg font-mono font-bold text-3xl tabular-numbers">
                {formatTimer(seconds)}
              </div>
              <p className="text-[11px] text-ink-400 font-medium">Đang kết nối thời gian thực & ghi âm Cloudflare R2</p>

              {/* Speech-to-Text Live Transcript */}
              <div className="p-3 bg-surface-subtle border border-line rounded-md text-left text-[11px] space-y-1">
                <p className="font-bold text-ink-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-brand-600" /> Bóc tách lời thoại (Speech-to-Text):
                </p>
                <p className="text-ink-500 italic leading-relaxed">"{speechTranscript}"</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-md border transition-colors ${
                    isMuted ? 'bg-warn-bg border-gold-border text-warn-fg' : 'bg-line-soft border-line text-ink-700'
                  }`}
                  title="Tắt/Mở Micro"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="w-12 h-12 rounded-full bg-danger-fg hover:bg-danger-deep text-white flex items-center justify-center shadow-md active:scale-95"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {callState === 'ENDED' && (
            <div className="py-3 text-ink-500 space-y-1">
              <p className="font-bold text-success-fg text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Đã hoàn tất cuộc gọi & lưu nhật ký
              </p>
              <p className="text-[11px] text-ink-400 font-mono">File ghi âm: r2.ggbingo.vn/call_voip_2026.mp3</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-surface-subtle border-t border-line text-[10px] text-ink-500 flex items-center justify-between px-3">
          <span>WebRTC Core: Ready 100%</span>
          <span>Đồng bộ CRM History</span>
        </div>
      </div>
    </div>
  );
}
