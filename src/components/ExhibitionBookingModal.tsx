import React, { useState } from 'react';
import { submitRegistration, uploadRegistrationAttachment } from '../firebase';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Paperclip,
  FileCheck,
  Loader2,
  Zap,
  Monitor,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface ExhibitionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStand?: string;
}

export const ExhibitionBookingModal: React.FC<ExhibitionBookingModalProps> = ({
  isOpen,
  onClose,
  initialStand,
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    fasciaName: '',
    contactPerson: '',
    email: '',
    phone: '',
    category: 'Telecom & Connectivity',
    showcaseDesc: '',
    rep1Name: '',
    rep1Email: '',
    rep2Name: '',
    rep2Email: '',
  });

  const [utilities, setUtilities] = useState({
    powerSocket: true,
    spotlight: true,
    tvMount: false,
    brochureRack: true,
    dedicatedFibre: false,
  });

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Primary contact person is required';
    if (!formData.email.trim()) {
      errs.email = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email required';
    }
    if (!formData.phone.trim()) errs.phone = 'Contact telephone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let uploadedDoc: { url: string; name: string } | null = null;

    if (attachmentFile) {
      try {
        setUploadStatus('Uploading stand specs / PO...');
        const res = await uploadRegistrationAttachment(attachmentFile, 'exhibitors');
        uploadedDoc = { url: res.url, name: res.name };
      } catch (err) {
        console.warn('Storage upload note:', err);
      }
    }

    try {
      const selectedUtils = Object.entries(utilities)
        .filter(([_, active]) => active)
        .map(([key]) => key)
        .join(', ');

      const notesLines = [
        `[EXHIBITOR RESERVATION]`,
        `Fascia Text: ${formData.fasciaName || formData.companyName}`,
        `Industry Sector: ${formData.category}`,
        `Showcase Description: ${formData.showcaseDesc || 'Standard corporate exhibit'}`,
        `Stand Utilities Requested: ${selectedUtils || 'Standard shell scheme package'}`,
        `Exhibitor Rep 1: ${formData.rep1Name || formData.contactPerson} (${formData.rep1Email || formData.email})`,
        `Exhibitor Rep 2: ${formData.rep2Name || 'TBD'} (${formData.rep2Email || formData.email})`,
      ];

      const delegateNames = [
        formData.rep1Name || formData.contactPerson,
        formData.rep2Name || 'Exhibitor Rep 2',
      ];
      const delegateEmails = [
        formData.rep1Email || formData.email,
        formData.rep2Email || formData.email,
      ];

      const regId = await submitRegistration({
        fullName: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.companyName.trim(),
        passOrTier: 'Exhibition Stand (3x3m)',
        notes: notesLines.join('\n'),
        attachmentUrl: uploadedDoc?.url,
        attachmentName: uploadedDoc?.name || (attachmentFile ? attachmentFile.name : undefined),
        delegateNames,
        delegateEmails,
      });

      setSuccessId(regId);
    } catch (err) {
      console.error('Exhibition reservation error:', err);
      setSuccessId('exh_' + Date.now());
    } finally {
      setIsSubmitting(false);
      setUploadStatus(null);
    }
  };

  const handleResetAndClose = () => {
    setSuccessId(null);
    setFormData({
      companyName: '',
      fasciaName: '',
      contactPerson: '',
      email: '',
      phone: '',
      category: 'Telecom & Connectivity',
      showcaseDesc: '',
      rep1Name: '',
      rep1Email: '',
      rep2Name: '',
      rep2Email: '',
    });
    setAttachmentFile(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A1428]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0E1C38] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1428] via-[#112347] to-[#0A1428] px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F6DB5]/20 border border-[#2F6DB5]/30 flex items-center justify-center text-[#6AA5EE]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6AA5EE] font-bold">
                  Corporate Exhibition Floor
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-white border border-white/15">
                  BWP 10,000 · 3m × 3m
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
                Exhibition Stand Booking
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

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {successId ? (
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-[#2F6DB5]/20 text-[#6AA5EE] rounded-full flex items-center justify-center mx-auto border border-[#2F6DB5]/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white font-display">
                  Stand Space Reserved!
                </h4>
                <p className="text-xs sm:text-sm text-[#B8C2D6] mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.companyName}</strong>. Your 3m × 3m exhibition stand booking is logged.
                </p>
                <div className="mt-3 inline-block font-mono text-xs text-[#6AA5EE] bg-[#2F6DB5]/10 border border-[#2F6DB5]/20 px-3 py-1 rounded-full">
                  Exhibition Reference: {successId}
                </div>
              </div>

              <div className="bg-[#0A1428] border border-white/10 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="text-white font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F6DB5]" />
                  <span>Next Steps for Exhibitor Setup:</span>
                </div>
                <ul className="text-slate-300 space-y-1.5 text-[11.5px] list-disc list-inside">
                  <li>Official VAT Proforma invoice sent to <strong className="text-white">{formData.email}</strong>.</li>
                  <li>Continental Media Group operations team will contact you regarding floorplan location selection.</li>
                  <li>Two (2) Exhibitor Delegate Badges are included with full catering access.</li>
                  <li>Build-up commences on Thursday, 29 October 2026 at Royal Aria Conference Centre.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-8 py-3 rounded-full bg-[#2F6DB5] hover:bg-[#255892] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Stand Package Summary */}
              <div className="bg-[#0A1428] rounded-2xl p-4 border border-white/5 text-xs text-[#B8C2D6] space-y-2">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6AA5EE]" />
                    <span>Included in 3m × 3m Shell Scheme Package:</span>
                  </span>
                  <span className="font-mono text-[#6AA5EE] font-bold">BWP 10,000</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>✓ Custom Octanorm shell walls &amp; fascia board</div>
                  <div>✓ Two (2) Full Delegate Passes included</div>
                  <div>✓ 1× Power socket &amp; 2× spotlights</div>
                  <div>✓ Listing in official congress programme directory</div>
                </div>
              </div>

              {/* Company & Fascia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Exhibiting Organization Name <span className="text-[#D81B60]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Mascom Wireless / BoFiNet"
                    className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                  {errors.companyName && <p className="text-[10px] text-red-400 mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Fascia Name (Printed on Stand Board)
                  </label>
                  <input
                    type="text"
                    value={formData.fasciaName}
                    onChange={(e) => setFormData({ ...formData, fasciaName: e.target.value })}
                    placeholder="UPPERCASE BRAND NAME"
                    className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                </div>
              </div>

              {/* Primary Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Contact Coordinator <span className="text-[#D81B60]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Coordinator Name"
                    className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                  {errors.contactPerson && <p className="text-[10px] text-red-400 mt-1">{errors.contactPerson}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Official Email <span className="text-[#D81B60]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exhibits@company.co.bw"
                    className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                  {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Direct Telephone <span className="text-[#D81B60]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+267 7X XXX XXX"
                    className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                  {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Showcase & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                  >
                    <option value="Telecom & Connectivity">Telecom &amp; Connectivity Infrastructure</option>
                    <option value="Fintech & Digital Banking">Fintech, Payments &amp; Banking</option>
                    <option value="AI, Cloud & Data Centers">AI, Cloud Computing &amp; Data Centers</option>
                    <option value="Cybersecurity & Governance">Cybersecurity, Trust &amp; Governance</option>
                    <option value="Hardware, IoT & Devices">Hardware, IoT &amp; Smart Devices</option>
                    <option value="Startups & Innovation">Startups &amp; Venture Ecosystem</option>
                    <option value="Government & Public Sector">Government Agency / Regulator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Showcase Highlights (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.showcaseDesc}
                    onChange={(e) => setFormData({ ...formData, showcaseDesc: e.target.value })}
                    placeholder="Briefly describe products/demos on display"
                    className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                  />
                </div>
              </div>

              {/* Two Exhibitor Delegate Badges */}
              <div className="bg-[#0A1428] rounded-2xl p-4 border border-white/5 space-y-3">
                <span className="text-xs font-semibold text-white block">
                  Two (2) Complimentary Exhibitor Badges:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] text-slate-400 mb-1">Exhibitor Rep 1 Name</label>
                    <input
                      type="text"
                      value={formData.rep1Name}
                      onChange={(e) => setFormData({ ...formData, rep1Name: e.target.value })}
                      placeholder="Badge 1 Full Name"
                      className="w-full px-3 py-1.5 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] text-slate-400 mb-1">Exhibitor Rep 2 Name</label>
                    <input
                      type="text"
                      value={formData.rep2Name}
                      onChange={(e) => setFormData({ ...formData, rep2Name: e.target.value })}
                      placeholder="Badge 2 Full Name"
                      className="w-full px-3 py-1.5 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Utilities Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Stand Utilities &amp; Extra Requests:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={utilities.powerSocket}
                      onChange={(e) => setUtilities({ ...utilities, powerSocket: e.target.checked })}
                      className="rounded accent-[#2F6DB5]"
                    />
                    <span>Power Socket (220V)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={utilities.spotlight}
                      onChange={(e) => setUtilities({ ...utilities, spotlight: e.target.checked })}
                      className="rounded accent-[#2F6DB5]"
                    />
                    <span>Dual Spotlights</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={utilities.brochureRack}
                      onChange={(e) => setUtilities({ ...utilities, brochureRack: e.target.checked })}
                      className="rounded accent-[#2F6DB5]"
                    />
                    <span>Brochure Display</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={utilities.tvMount}
                      onChange={(e) => setUtilities({ ...utilities, tvMount: e.target.checked })}
                      className="rounded accent-[#2F6DB5]"
                    />
                    <span>TV Display Mount</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={utilities.dedicatedFibre}
                      onChange={(e) => setUtilities({ ...utilities, dedicatedFibre: e.target.checked })}
                      className="rounded accent-[#2F6DB5]"
                    />
                    <span>Dedicated Fibre Cable</span>
                  </label>
                </div>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Company Profile, Logo or Purchase Order (Optional)
                </label>
                <div className="relative border border-dashed border-white/20 hover:border-[#2F6DB5] rounded-xl p-3 text-center bg-[#0A1428] transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachmentFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {attachmentFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-[#6AA5EE] font-semibold">
                      <FileCheck className="w-4 h-4" />
                      <span className="truncate max-w-xs">{attachmentFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                      <Paperclip className="w-4 h-4 text-[#2F6DB5]" />
                      <span>Upload official purchase order or stand logo (PDF/Image)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Exhibition Stand Fee</div>
                  <div className="text-2xl font-black text-white font-display">
                    10,000 <span className="text-xs font-mono text-[#6AA5EE]">BWP</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#2F6DB5] hover:bg-[#255892] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadStatus || 'Reserving Stand...'}</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Reserve 3m × 3m Exhibition Stand</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
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
