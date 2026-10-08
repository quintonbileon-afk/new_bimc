import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS, CORPORATE_RATE_CARD } from '../data/bmicContent';
import { X, Send, CheckCircle2, User, Mail, Phone, Building, Sparkles } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelection?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialSelection,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    passOrTier: initialSelection || 'Corporate Delegate',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialSelection) {
      setFormData((prev) => ({ ...prev, passOrTier: initialSelection }));
    }
  }, [initialSelection]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07101F]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B1B33] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#2F6296] via-[#1A3E63] to-[#D61356] px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-pink-200 uppercase tracking-widest font-bold">
              BMIC 2026 · Official Corporate Registration
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              Rate Card &amp; Passes Booking
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                Booking Logged
              </h4>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your reservation for <strong>{formData.passOrTier}</strong> has been received by the Continental Media Group secretariat.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-mono mb-6 space-y-1 text-left">
                <div>Direct Tel: <span className="text-white font-bold">{EVENT_DETAILS.enquiriesPhone}</span></div>
                <div>Email: <span className="text-white font-bold">{EVENT_DETAILS.contactEmail}</span></div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Organised by {EVENT_DETAILS.organiser} · Empowered by {EVENT_DETAILS.empoweredBy}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-gradient-to-r from-[#2F6296] to-[#D61356] text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="e.g. Kgosi Molefe"
                    className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white/[0.05] border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-white/15 focus:ring-[#2F6296]'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="name@organization.bw"
                    className={`w-full pl-10 pr-3 py-2.5 text-xs bg-white/[0.05] border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/15 focus:ring-[#2F6296]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+267 ..."
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#2F6296]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Organization / Ministry
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Organization"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#2F6296]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Package (Corporate Rate Card)
                </label>
                <select
                  value={formData.passOrTier}
                  onChange={(e) => setFormData({ ...formData, passOrTier: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#07101F] border border-white/15 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#2F6296]"
                >
                  <optgroup label="Delegate Access">
                    {CORPORATE_RATE_CARD.delegateAccess.map((tier) => (
                      <option key={tier.id} value={tier.title}>
                        {tier.title} — {tier.price}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Strategic Partnership">
                    {CORPORATE_RATE_CARD.strategicPartnership.map((partner) => (
                      <option key={partner.id} value={partner.title}>
                        {partner.title} — {partner.price}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Exhibition">
                    {CORPORATE_RATE_CARD.exhibition.map((exh) => (
                      <option key={exh.id} value={exh.title}>
                        {exh.title} — {exh.price}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Special Requirements / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Dietary, accessibility, or multi-delegate delegation requirements..."
                  className="w-full px-3.5 py-2 text-xs bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#2F6296]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#2F6296] via-[#853C77] to-[#D61356] text-white rounded-xl text-xs font-bold shadow-xl shadow-[#D61356]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Rate Card Booking</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-400 font-mono pt-1">
                Direct phone: {EVENT_DETAILS.enquiriesPhone} · {EVENT_DETAILS.contactEmail}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
