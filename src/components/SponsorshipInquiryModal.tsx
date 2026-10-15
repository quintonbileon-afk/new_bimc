import React, { useState, useEffect } from 'react';
import { submitRegistration, uploadRegistrationAttachment } from '../firebase';
import { EVENT_DETAILS } from '../data/bmicContent';
import {
  X,
  Zap,
  Building,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Paperclip,
  FileCheck,
  Loader2,
  Award,
  Crown,
  ShieldCheck,
  Calendar,
  FileText,
  ArrowRight
} from 'lucide-react';

interface SponsorshipInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: string;
}

export const SponsorshipInquiryModal: React.FC<SponsorshipInquiryModalProps> = ({
  isOpen,
  onClose,
  initialPackage,
}) => {
  const SPONSORSHIP_TIERS = [
    {
      id: 'headline-partner',
      name: 'Headline Strategic Partner',
      price: '150,000',
      priceNum: 150000,
      badge: 'Exclusive Accord',
      isHeadline: true,
      description: 'Exclusive sovereign branding, keynote ministerial session, 10 VIP passes, 6m×3m premier exhibition stand',
    },
    {
      id: 'infrastructure-track',
      name: 'Track: Digital Infrastructure & Sovereign Policy',
      price: '50,000',
      priceNum: 50000,
      badge: 'Connectivity Track',
      description: 'Track naming rights, opening panel keynote, 5 delegate passes, curated bilateral roundtable',
    },
    {
      id: 'cybersecurity-track',
      name: 'Track: Cybersecurity, Trust & Data Governance',
      price: '50,000',
      priceNum: 50000,
      badge: 'Security & Regs',
      description: 'Lead presentation, BOCRA & Data Protection commission session alignment, 5 delegate passes',
    },
    {
      id: 'fintech-track',
      name: 'Track: Fintech, Payments & Digital Monetisation',
      price: '50,000',
      priceNum: 50000,
      badge: 'Capital & Commerce',
      description: 'Fintech panel keynote, mobile network operator executive alignment, 5 delegate passes',
    },
    {
      id: 'tech-for-good-track',
      name: 'Track: Tech For Good & Inclusive Innovation',
      price: '50,000',
      priceNum: 50000,
      badge: 'Impact & Skills',
      description: 'SME & developer ecosystem showcase alignment, hackathon prize naming, 5 delegate passes',
    },
  ];

  const [selectedTierId, setSelectedTierId] = useState<string>('headline-partner');
  const [formData, setFormData] = useState({
    companyName: '',
    executiveName: '',
    executiveTitle: '',
    email: '',
    phone: '',
    requestType: 'Invoice & Proposal',
    strategicNotes: '',
  });

  const [objectives, setObjectives] = useState({
    keynoteSession: true,
    ministerialRoundtable: true,
    vipDelegates: true,
    customPavilion: false,
    pressConference: false,
  });

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (initialPackage) {
      const match = SPONSORSHIP_TIERS.find((t) =>
        t.name.toLowerCase().includes(initialPackage.toLowerCase()) ||
        initialPackage.toLowerCase().includes(t.name.toLowerCase())
      );
      if (match) {
        setSelectedTierId(match.id);
      }
    }
  }, [initialPackage]);

  const selectedTier = SPONSORSHIP_TIERS.find((t) => t.id === selectedTierId) || SPONSORSHIP_TIERS[0];

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.executiveName.trim()) errs.executiveName = 'Executive representative is required';
    if (!formData.email.trim()) {
      errs.email = 'Corporate email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid corporate email required';
    }
    if (!formData.phone.trim()) errs.phone = 'Direct telephone is required';
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
        setUploadStatus('Uploading corporate brief...');
        const res = await uploadRegistrationAttachment(attachmentFile, 'sponsors');
        uploadedDoc = { url: res.url, name: res.name };
      } catch (err) {
        console.warn('Storage upload note:', err);
      }
    }

    try {
      const chosenObjectives = Object.entries(objectives)
        .filter(([_, active]) => active)
        .map(([k]) => k)
        .join(', ');

      const notesLines = [
        `[STRATEGIC PARTNERSHIP INQUIRY]`,
        `Selected Package: ${selectedTier.name} (BWP ${selectedTier.price})`,
        `Executive Designation: ${formData.executiveTitle || 'Executive Lead'}`,
        `Request Action: ${formData.requestType}`,
        `Strategic Priorities: ${chosenObjectives || 'Standard sponsorship entitlements'}`,
        formData.strategicNotes ? `Executive Notes: ${formData.strategicNotes}` : '',
      ].filter(Boolean);

      const regId = await submitRegistration({
        fullName: formData.executiveName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.companyName.trim(),
        passOrTier: selectedTier.name,
        notes: notesLines.join('\n'),
        attachmentUrl: uploadedDoc?.url,
        attachmentName: uploadedDoc?.name || (attachmentFile ? attachmentFile.name : undefined),
      });

      setSuccessId(regId);
    } catch (err) {
      console.error('Sponsorship inquiry error:', err);
      setSuccessId('spn_' + Date.now());
    } finally {
      setIsSubmitting(false);
      setUploadStatus(null);
    }
  };

  const handleResetAndClose = () => {
    setSuccessId(null);
    setFormData({
      companyName: '',
      executiveName: '',
      executiveTitle: '',
      email: '',
      phone: '',
      requestType: 'Invoice & Proposal',
      strategicNotes: '',
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
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-purple-300 font-bold">
                  Sovereign Partnership
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D81B60] text-white">
                  Executive Accords
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
                Strategic Sponsorship Inquiry
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

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {successId ? (
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white font-display">
                  Partnership Dossier Logged
                </h4>
                <p className="text-xs sm:text-sm text-[#B8C2D6] mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.executiveName}</strong> ({formData.companyName}). Your interest in the <strong className="text-white">{selectedTier.name}</strong> has been transmitted to the BMIC Directorate.
                </p>
                <div className="mt-3 inline-block font-mono text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  Accord Reference: {successId}
                </div>
              </div>

              <div className="bg-[#0A1428] border border-white/10 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="text-white font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Next Executive Steps:</span>
                </div>
                <ul className="text-slate-300 space-y-1.5 text-[11.5px] list-disc list-inside">
                  <li>An executive partnership briefing and commercial proposal will be emailed to <strong className="text-white">{formData.email}</strong>.</li>
                  <li>Secretariat executive director will schedule a bilateral briefing call with your leadership team.</li>
                  <li>Category exclusivity is reserved on a first-come, first-committed basis.</li>
                  <li>For urgent inquiries, contact the Secretariat directly at <strong className="text-white">{EVENT_DETAILS.enquiriesPhone}</strong>.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Package */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  1. Select Strategic Partnership Tier
                </label>
                <div className="space-y-2.5">
                  {SPONSORSHIP_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#1C1635] border-purple-500 ring-1 ring-purple-500 shadow-lg'
                            : 'bg-[#0A1428] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-xs sm:text-sm">
                              {tier.name}
                            </span>
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              tier.isHeadline ? 'bg-[#D81B60] text-white' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}>
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-2">
                            {tier.description}
                          </p>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <div className="font-mono text-base sm:text-lg font-black text-white">
                            {tier.price} <span className="text-xs font-mono text-purple-300">BWP</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Executive Contact Details */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <span className="text-xs font-semibold text-slate-300 block">
                  2. Executive Representative &amp; Organization
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Organization / Enterprise <span className="text-[#D81B60]">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Corporate entity name"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                    {errors.companyName && <p className="text-[10px] text-red-400 mt-1">{errors.companyName}</p>}
                  </div>

                  {/* Representative Name */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Executive Representative <span className="text-[#D81B60]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.executiveName}
                        onChange={(e) => setFormData({ ...formData, executiveName: e.target.value })}
                        placeholder="e.g. Dr. Thabo Molefe"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                    {errors.executiveName && <p className="text-[10px] text-red-400 mt-1">{errors.executiveName}</p>}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Executive Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.executiveTitle}
                      onChange={(e) => setFormData({ ...formData, executiveTitle: e.target.value })}
                      placeholder="e.g. Chief Executive Officer / VP Public Policy"
                      className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Direct Telephone <span className="text-[#D81B60]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+267 7X XXX XXX"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Corporate / Institutional Email <span className="text-[#D81B60]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="executive.office@telecom.co.bw"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Strategic Objectives */}
              <div className="bg-[#0A1428] rounded-2xl p-4 border border-white/5 space-y-2.5">
                <span className="text-xs font-semibold text-white block">
                  3. Key Corporate Priorities (Select All That Apply):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={objectives.keynoteSession}
                      onChange={(e) => setObjectives({ ...objectives, keynoteSession: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>Keynote / Thought Leadership Address</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={objectives.ministerialRoundtable}
                      onChange={(e) => setObjectives({ ...objectives, ministerialRoundtable: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>Ministerial &amp; Regulator Bilateral</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={objectives.vipDelegates}
                      onChange={(e) => setObjectives({ ...objectives, vipDelegates: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>VIP Delegation Pass Allocation</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={objectives.customPavilion}
                      onChange={(e) => setObjectives({ ...objectives, customPavilion: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>Prominent Exhibition Stand / Pavilion</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={objectives.pressConference}
                      onChange={(e) => setObjectives({ ...objectives, pressConference: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>Joint Press Briefing &amp; Media Release</span>
                  </label>
                </div>
              </div>

              {/* Action Requested */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Requested Secretariat Action:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'Invoice & Proposal', label: 'Issue Proforma Invoice & Accord' },
                    { key: 'Briefing Meeting', label: 'Schedule Briefing with Secretariat' },
                    { key: 'Custom Accord', label: 'Tailor Custom Accord Package' },
                  ].map((act) => (
                    <button
                      key={act.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, requestType: act.key })}
                      className={`p-2.5 text-center text-xs rounded-xl border transition-all cursor-pointer font-medium ${
                        formData.requestType === act.key
                          ? 'bg-purple-600/30 border-purple-400 text-white'
                          : 'bg-[#0A1428] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Attach Corporate Letter of Intent / Purchase Order (Optional)
                </label>
                <div className="relative border border-dashed border-white/20 hover:border-purple-400 rounded-xl p-3 text-center bg-[#0A1428] transition-colors">
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
                    <div className="flex items-center justify-center gap-2 text-xs text-purple-300 font-semibold">
                      <FileCheck className="w-4 h-4" />
                      <span className="truncate max-w-xs">{attachmentFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                      <Paperclip className="w-4 h-4 text-purple-400" />
                      <span>Upload official corporate brief or purchase requisition (PDF)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Partnership Value</div>
                  <div className="text-2xl font-black text-white font-display">
                    {selectedTier.price} <span className="text-xs font-mono text-purple-300">BWP</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-[#D81B60] hover:brightness-110 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadStatus || 'Transmitting Dossier...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Submit Strategic Sponsorship Dossier</span>
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
