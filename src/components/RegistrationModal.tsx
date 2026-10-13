import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS, CORPORATE_RATE_CARD } from '../data/bmicContent';
import { submitRegistration } from '../firebase';
import { X, Send, CheckCircle2, User, Mail, Phone, Building, Loader2, AlertCircle } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const regId = await submitRegistration({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        passOrTier: formData.passOrTier,
        notes: formData.notes,
      });
      setSubmittedId(regId);
    } catch (err: unknown) {
      console.error('Registration save error:', err);
      setSubmitError('Unable to save registration to database. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedId(null);
    setSubmitError(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1428]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0E1C38] text-white rounded-[12px] shadow-2xl border border-white/10 overflow-hidden">
        {/* Header bar */}
        <div className="bg-[#0A1428] px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div>
            <div className="text-[11px] text-[#2F6DB5] uppercase tracking-wider font-semibold">
              BMIC 2026 · Official Registration
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
              Rate Card &amp; Passes Booking
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {submittedId ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Booking Logged in Database
              </h4>
              <p className="text-xs text-[#B8C2D6] mb-4 leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your reservation for <strong>{formData.passOrTier}</strong> has been secured in the official congress database.
              </p>
              
              <div className="p-3 bg-[#0A1428] border border-white/10 rounded-[8px] mb-6 text-xs text-[#B8C2D6]">
                <span className="text-slate-400">Reference ID:</span>{' '}
                <span className="text-white font-mono font-semibold">{submittedId}</span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#0A1428] border border-white/10 text-xs text-[#B8C2D6] mb-6 space-y-1 text-left">
                <div>Direct Tel: <span className="text-white font-semibold">{EVENT_DETAILS.enquiriesPhone}</span></div>
                <div>Email: <span className="text-white font-semibold">{EVENT_DETAILS.contactEmail}</span></div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Organised by {EVENT_DETAILS.organiser} · Empowered by {EVENT_DETAILS.empoweredBy}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#D81B60] hover:bg-[#c2185b] text-white rounded-full text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#B8C2D6] mb-1.5">
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
                    className={`w-full pl-10 pr-3 py-2.5 text-xs bg-[#0A1428] border rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5] ${
                      errors.fullName ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#B8C2D6] mb-1.5">
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
                    className={`w-full pl-10 pr-3 py-2.5 text-xs bg-[#0A1428] border rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5] ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#B8C2D6] mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+267 ..."
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0A1428] border border-white/10 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B8C2D6] mb-1.5">
                    Organization / Entity
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Organization"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0A1428] border border-white/10 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#B8C2D6] mb-1.5">
                  Select Package (Corporate Rate Card)
                </label>
                <select
                  value={formData.passOrTier}
                  onChange={(e) => setFormData({ ...formData, passOrTier: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#0A1428] border border-white/10 rounded-full text-white focus:outline-none focus:border-[#2F6DB5]"
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
                <label className="block text-xs font-medium text-[#B8C2D6] mb-1.5">
                  Special Requirements / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Dietary, accessibility, or multi-delegate requirements..."
                  className="w-full px-3.5 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-[12px] text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#D81B60] hover:bg-[#c2185b] disabled:opacity-50 text-white rounded-full text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Rate Card Booking</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-400 pt-1">
                Direct phone: {EVENT_DETAILS.enquiriesPhone} · {EVENT_DETAILS.contactEmail}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
