import React, { useState, useEffect } from 'react';
import { submitRegistration } from '../firebase';
import { X, Send, CheckCircle2, Phone, Mail, Building, User, Loader2, AlertCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialTier,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    tierOrRole: initialTier || 'Delegate / Attendee',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialTier) {
      setFormData((prev) => ({ ...prev, tierOrRole: initialTier }));
    }
  }, [initialTier]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Please provide your full name and a valid email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const regId = await submitRegistration({
        type: 'enquiry',
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim() || 'Direct Inquiry',
        passOrTier: formData.tierOrRole,
        notes: formData.notes.trim() || 'General enquiry submitted via portal.',
        status: 'pending',
      });

      setSubmittedId(regId);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save enquiry to Cloud Firestore.';
      setErrorMessage(`Submission failed: ${msg}. Please check your connection and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedId(null);
    setErrorMessage(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      tierOrRole: initialTier || 'Delegate / Attendee',
      notes: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header bar */}
        <div className="bg-[#235A82] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-sky-200 uppercase tracking-widest font-semibold">
              BMIC 2026 · Secretariat
            </div>
            <h3 className="text-lg font-bold">
              Delegate &amp; Partner Enquiry
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submittedId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">
                  Enquiry Logged in Database
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your enquiry regarding <strong>{formData.tierOrRole}</strong> has been secured in the official congress database.
                </p>
                <div className="mt-3 inline-block font-mono text-xs text-[#235A82] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Reference: {submittedId}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-[#235A82] hover:bg-[#163B57] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#235A82] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@organization.bw"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#235A82] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+267 ..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#235A82] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Company / Org"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#235A82] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enquiry Category
                </label>
                <select
                  value={formData.tierOrRole}
                  onChange={(e) => setFormData({ ...formData, tierOrRole: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#235A82] focus:outline-none bg-white"
                >
                  <option value="Delegate / Attendee">Delegate / Attendee</option>
                  <option value="Headline Partner">Headline Partner (Keynote, Branding, Address)</option>
                  <option value="Track Sponsor">Track Sponsor (Cybersecurity, AI, Connectivity, Startups, Content)</option>
                  <option value="Exhibitor">Exhibitor (Branded Exhibition Presence)</option>
                  <option value="Media / Community Partner">Media / Community Partner</option>
                  <option value="Speakers">Prospective Speaker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional details..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#235A82] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#235A82] hover:bg-[#163B57] text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
