import React, { useState } from 'react';
import { submitRegistration, generateTicketsForBooking, TicketRecord } from '../firebase';
import { TicketCard } from './TicketCard';
import {
  X,
  Sparkles,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Ticket,
  Printer,
  ArrowRight,
  Loader2,
  Calendar,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';

interface FreePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreePassModal: React.FC<FreePassModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    interest: 'Tech & Telecom Innovation',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<TicketRecord | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const regId = await submitRegistration({
        type: 'free_pass',
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim() || 'General Attendee',
        passOrTier: 'Free Pass - Exhibition Floor',
        notes: `Area of interest: ${formData.interest}`,
        status: 'confirmed',
      });

      setBookingId(regId);

      // Generate digital ticket pass immediately for instant access
      const createdTickets = await generateTicketsForBooking(
        {
          id: regId,
          type: 'free_pass',
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          organization: formData.organization.trim() || 'General Attendee',
          passOrTier: 'Free Pass - Exhibition Floor',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        [{ name: formData.fullName.trim(), email: formData.email.trim() }]
      );

      if (createdTickets && createdTickets.length > 0) {
        setGeneratedTicket(createdTickets[0]);
      }
    } catch (err) {
      console.error('Error claiming free pass:', err);
      const msg = err instanceof Error ? err.message : 'Failed to register free pass in Cloud Firestore.';
      setErrorMessage(`Registration error: ${msg}. Please check your connection and try again.`);
      setGeneratedTicket(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setGeneratedTicket(null);
    setBookingId(null);
    setErrorMessage(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      interest: 'Tech & Telecom Innovation',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A1428]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0E1C38] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="relative bg-gradient-to-r from-[#0A1428] via-[#112347] to-[#0A1428] px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F6DB5]/20 border border-[#2F6DB5]/30 flex items-center justify-center text-[#6AA5EE]">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6AA5EE] font-bold">
                  Complimentary Badge
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-white border border-white/15">
                  BWP 0 · 100% Free
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
                Exhibition Floor Pass
              </h3>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {generatedTicket ? (
            /* Instant Ticket Card Issued State */
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-14 h-14 bg-[#2F6DB5]/20 text-[#6AA5EE] rounded-2xl flex items-center justify-center mx-auto border border-[#2F6DB5]/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Your Pass is Confirmed!
                </h4>
                <p className="text-xs sm:text-sm text-[#B8C2D6] mt-1.5 max-w-md mx-auto leading-relaxed">
                  Welcome to BMIC 2026. Your official digital exhibition badge has been issued with scannable entry verification.
                </p>
              </div>

              {/* Rendered Digital Pass Card */}
              <div className="max-w-md mx-auto text-left">
                <TicketCard ticket={generatedTicket} />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <Printer className="w-4 h-4 text-[#6AA5EE]" />
                  <span>Print / Save Badge</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2F6DB5] hover:bg-[#255892] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}
              {/* Value Highlight Banner */}
              <div className="bg-[#0A1428] rounded-2xl p-4 border border-white/5 text-xs text-[#B8C2D6] space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Sparkles className="w-4 h-4 text-[#6AA5EE] shrink-0" />
                  <span>What your Free Exhibition Pass includes:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#6AA5EE]">✓</span> Full access to 50+ tech exhibits
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#6AA5EE]">✓</span> Open networking floor &amp; lounges
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#6AA5EE]">✓</span> Startup showcase &amp; live demos
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#6AA5EE]">✓</span> Instant scannable digital pass
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-400 pt-1 border-t border-white/5">
                  Note: Plenary auditorium seating, catered delegate lunches, and private C-suite roundtables require a Delegate Pass.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-[#D81B60]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Kagiso Motsepe"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Email Address <span className="text-[#D81B60]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.bw or personal email"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Organization & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Organization / Institution
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Company, University or Self"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+267 7X XXX XXX"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                </div>
              </div>

              {/* Area of Interest */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Area of Interest
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#0A1428] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                >
                  <option value="Tech & Telecom Innovation">Telecom, 5G &amp; Fibre Connectivity</option>
                  <option value="AI, Cloud & Data Infrastructure">AI, Cloud &amp; Data Centers</option>
                  <option value="Fintech & Digital Payments">Fintech, Payments &amp; Mobile Money</option>
                  <option value="Startups & Founders Showcase">Startups, Venture &amp; Tech Talent</option>
                  <option value="Policy, Regulation & Government">Digital Policy &amp; Sovereign Regulation</option>
                  <option value="General Tech Explorer">General Visitor / Tech Explorer</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full btn-cta-magenta text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Pass...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Claim Free Exhibition Floor Pass</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#2F6DB5]" /> Friday, 30 October 2026
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D81B60]" /> Royal Aria, Gaborone
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
