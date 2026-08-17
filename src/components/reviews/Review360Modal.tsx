'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, Users, ShieldCheck, Sliders, ThumbsUp, Send, HeartHandshake, UserCheck, MessageSquare, Sparkles } from 'lucide-react';
import { Review360Session, ReviewerPerspective, EvaluationCriterion } from '@/types';
import { submit360Feedback } from '@/lib/review360Store';

interface Review360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Review360Session | null;
  onSubmitted: () => void;
}

export default function Review360Modal({ isOpen, onClose, session, onSubmitted }: Review360ModalProps) {
  const [perspective, setPerspective] = useState<ReviewerPerspective>('PEER');
  const [reviewerName, setReviewerName] = useState('Nguyễn Văn Minh');
  const [reviewerRole, setReviewerRole] = useState('Đồng Nghiệp Ngang Cấp');

  const [scores, setScores] = useState<Record<string, number>>({});
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  useEffect(() => {
    if (session) {
      const initScores: Record<string, number> = {};
      session.criteria_framework.forEach((c) => {
        initScores[c.id] = 8.5;
      });
      setScores(initScores);
      setStrengths('');
      setImprovements('');
    }
  }, [session, isOpen]);

  if (!isOpen || !session) return null;

  const handleScoreChange = (critId: string, val: number) => {
    setScores((prev) => ({ ...prev, [critId]: val }));
  };

  // Realtime Weighted Score Calculation (0 - 100)
  const computeTotalWeightedScore = () => {
    let sum = 0;
    session.criteria_framework.forEach((crit) => {
      const s = scores[crit.id] ?? 8.5;
      sum += s * (crit.weight / 10);
    });
    return Math.round(sum * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit360Feedback(session.id, {
      reviewer_name: reviewerName,
      reviewer_role: reviewerRole,
      perspective,
      scores,
      strengths_comment: strengths,
      improvements_comment: improvements,
    });
    onSubmitted();
    onClose();
  };

  return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"> <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200"> {/* Modal Header */} <div className="bg-blue-50 border-b border-blue-100 p-5 flex items-center justify-between"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-medium text-white shadow-md"> <Users className="w-5 h-5" /> </div> <div> <h2 className="text-base font-semibold text-blue-700"> Thực Hiện Đánh Giá 360°: {session.employee_name} </h2> <p className="text-xs text-slate-500"> {session.review_code} • Kỳ đánh giá: <strong className="text-amber-600">{session.period_name}</strong> </p> </div> </div> <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-blue-100 transition-colors"> <X className="w-5 h-5" /> </button> </div> {/* Modal Form */} <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"> {/* Section 1: Reviewer Role & Perspective */} <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"> <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-1.5"> <UserCheck className="w-4 h-4 text-blue-600" /> Góc Nhìn Đánh Giá </h3> <div className="grid grid-cols-2 md:grid-cols-4 gap-2"> {[
                { type: 'SELF', label: '👤 Tự Đánh Giá' },
                { type: 'MANAGER', label: '👔 Quản Lý Trực Tiếp' },
                { type: 'PEER', label: '🤝 Đồng Nghiệp' },
                { type: 'SUBORDINATE', label: '👥 Cấp Dưới' },
              ].map((p) => ( <button
                  key={p.type}
                  type="button"
                  onClick={() => {
                    setPerspective(p.type as ReviewerPerspective);
                    if (p.type === 'SELF') setReviewerRole('Bản Thân');
                    else if (p.type === 'MANAGER') setReviewerRole('Quản Lý Trực Tiếp');
                    else if (p.type === 'PEER') setReviewerRole('Đồng Nghiệp Ngang Cấp');
                    else setReviewerRole('Cấp Dưới');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-medium transition-all border text-center ${
                    perspective === p.type ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                > {p.label} </button> ))} </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1"> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Họ & Tên Người Đánh Giá *</label> <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  required
                /> </div> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Chức Danh Người Đánh Giá</label> <input
                  type="text"
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                /> </div> </div> </div> {/* Section 2: Customizable Criteria Sliders */} <div className="space-y-4"> <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-200 pb-2"> <Sliders className="w-4 h-4" /> Tiêu Chí Đánh Giá </h3> <div className="space-y-3"> {session.criteria_framework.map((crit) => {
                const currentScore = scores[crit.id] ?? 8.5;
                return ( <div key={crit.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"> <div className="flex items-center justify-between"> <div> <span className="font-medium text-xs text-slate-900">{crit.name}</span> <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded font-medium">Trọng số {crit.weight}%</span> <p className="text-[11px] text-slate-500 mt-0.5">{crit.description}</p> </div> <span className="font-mono font-semibold text-blue-700 text-sm">{currentScore.toFixed(1)} / 10 điểm</span> </div> <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={currentScore}
                      onChange={(e) => handleScoreChange(crit.id, parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    /> </div> );
              })} </div> </div> {/* Section 3: Qualitative Feedback Comments */} <div className="space-y-3"> <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-200 pb-2"> <MessageSquare className="w-4 h-4" /> Nhận Xét Chi Tiết </h3> <div> <label className="block text-xs font-semibold text-slate-700 mb-1">🌟 Điểm Mạnh Nổi Bật Của Nhân Sự:</label> <textarea
                rows={2}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="Nhập những ưu điểm, thành tích nổi bật và đóng góp tích cực..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              /> </div> <div> <label className="block text-xs font-semibold text-slate-700 mb-1"> Điểm Cần Cải Thiện & Khuyến Nghị Phát Triển:</label> <textarea
                rows={2}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Nhập các gợi ý phát triển bản thân, giải pháp nâng cao hiệu suất..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              /> </div> </div> {/* Live Score Summary Banner */} <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between"> <div> <p className="text-[11px] text-slate-500 font-medium uppercase">Điểm 360° Quy Đổi Thời Gian Thực:</p> <p className="text-2xl font-semibold text-blue-700">{computeTotalWeightedScore()} / 100 Điểm</p> </div> <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium shadow-md flex items-center gap-1.5"
            > <Send className="w-4 h-4" /> Gửi Đánh Giá 360° </button> </div> </form> </div> </div> );
}
