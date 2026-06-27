"use client";

import { useState } from "react";
import { Zap, Calendar, Star, X } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export function PricingModal({ open, onClose, defaultPlan }: PricingModalProps) {
  const [selPlan, setSelPlan] = useState(defaultPlan || "pro");

  if (!open) return null;

  const plans = [
    { id: "pro", icon: <Zap className="h-5 w-5" />, title: "Pro Monthly", desc: "Unlimited · ad-free · all formats", price: "$9", period: "/mo" },
    { id: "annual", icon: <Calendar className="h-5 w-5" />, title: "Pro Annual", desc: "Save 40% vs monthly", price: "$5.40", period: "/mo", badge: "Save $43/yr" },
    { id: "lifetime", icon: <Star className="h-5 w-5" />, title: "Lifetime Access", desc: "Pay once · use forever", price: "$79", period: " once", badge: "Best value", gold: true },
  ];

  const ctaText = selPlan === "lifetime" ? "Buy Lifetime Access — $79" : selPlan === "annual" ? "Start Pro Annual — $5.40/mo" : "Start Pro Monthly — $9/mo";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-neutral-primary-soft rounded-base max-w-[480px] w-full p-9 relative shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <button onClick={onClose} className="absolute top-3.5 right-4 bg-none border-none cursor-pointer text-body p-1" aria-label="Close modal"><X className="h-5 w-5" /></button>
        <h2 className="text-[22px] font-extrabold text-heading mb-2">Upgrade your plan</h2>
        <p className="text-[14px] text-body mb-7">More power, more formats, no ads.</p>

        <div className="flex flex-col gap-3">
          {plans.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelPlan(p.id)}
              className={`flex items-center gap-3.5 border-2 rounded-base p-4 cursor-pointer transition-all ${
                selPlan === p.id
                  ? p.gold ? "border-warning bg-warning-soft" : "border-brand bg-brand-softer"
                  : "border-border-default hover:border-border-default-medium"
              }`}
            >
              <span className={`flex items-center justify-center w-10 h-10 rounded-base shrink-0 ${
                selPlan === p.id ? (p.gold ? "bg-warning-medium text-fg-warning" : "bg-brand-soft text-fg-brand") : "bg-neutral-tertiary text-body"
              }`}>
                {p.icon}
              </span>
              <div className="flex-1">
                <strong className="block text-[15px] font-bold text-heading">{p.title}</strong>
                <span className="text-[13px] text-body">{p.desc}</span>
                {p.badge && <span className="text-[10px] font-extrabold bg-warning text-white px-1.5 py-0.5 rounded-full inline-block mt-0.5 ml-2">{p.badge}</span>}
              </div>
              <div className="text-right text-[16px] font-extrabold text-heading whitespace-nowrap">
                {p.price}<small className="text-[11px] text-body font-normal block">{p.period}</small>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className={`btn-brand w-full text-center py-3 text-[16px] mt-5`}
        >
          {ctaText}
        </button>

        <p className="text-center text-xs text-body mt-3"><strong className="text-fg-success">30-day money-back guarantee</strong> · No questions asked</p>
      </div>
    </div>
  );
}
