import React, { useState, useEffect } from 'react';
import { submitRegistration, uploadRegistrationAttachment } from '../firebase';
import { EVENT_DETAILS, CORPORATE_RATE_CARD } from '../data/bmicContent';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Paperclip,
  FileCheck,
  Loader2,
  Users,
  ShieldCheck,
  CreditCard,
  Briefcase,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface DelegateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: string;
}

export const DelegateRegistrationModal: React.FC<DelegateRegistrationModalProps> = ({
  isOpen,
  onClose,
  initialTier,
}) => {
  const DELEGATE_TIERS = [
    {
      id: 'student-developer',
      name: 'Student / Developer Pass',
      price: '950',
      priceNum: 950,
      description: 'Accredited student ID or active developer GitHub profile required',
      badge: 'Builders & Talent',
    },
    {
      id: 'standard-delegate',
      name: 'Standard Delegate',
      price: '1,500',
      priceNum: 1500,
      description: 'Full plenary hall access, exhibition, and general networking lounge',
      badge: 'Single Access',
    },
    {
      id: 'corporate-delegate',
      name: 'Corporate Delegate',
      price: '2,500',
      priceNum: 2500,
      description: 'Plenary hall, executive networking lunch, digital congress pack & speaker slides',
      badge: 'Popular',
      isPopular: true,
    },
    {
      id: 'corporate-pack',
      name: 'Corporate Pack (3 Delegates)',
      price: '5,000',
      priceNum: 5000,
      description: 'Admission for 3 corporate executives (Save BWP 2,500 enterprise discount)',
      badge: 'Team Savings',
    },
  ];

  const [selectedTierId, setSelectedTierId] = useState<string>('corporate-delegate');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    dietaryNotes: '',
    referenceNumber: '',
  });

  const [delegate1Name, setDelegate1Name] = useState('');
  const [delegate1Email, setDelegate1Email] = useState('');
  const [delegate2Name, setDelegate2Name] = useState('');
  const [delegate2Email, setDelegate2Email] = useState('');
  const [delegate3Name, setDelegate3Name] = useState('');
  const [delegate3Email, setDelegate3Email] = useState('');

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessId, setSubmitSuccessId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTier) {
      const match = DELEGATE_TIERS.find((t) =>
        t.name.toLowerCase().includes(initialTier.toLowerCase()) ||
        initialTier.toLowerCase().includes(t.name.toLowerCase())
      );
      if (match) {
        setSelectedTierId(match.id);
      }
    }
  }, [initialTier]);

  const selectedTier = DELEGATE_TIERS.find((t) => t.id === selectedTierId) || DELEGATE_TIERS[2];
  const isCorporatePack = selectedTier.id === 'corporate-pack';

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
    }
    if (isCorporatePack) {
      if (!delegate1Name.trim()) errs.delegate1Name = 'Delegate 1 name is required';
      if (!delegate2Name.trim()) errs.delegate2Name = 'Delegate 2 name is required';
      if (!delegate3Name.trim()) errs.delegate3Name = 'Delegate 3 name is required';
    }
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
        setUploadStatus('Uploading payment document...');
        const res = await uploadRegistrationAttachment(attachmentFile, 'delegates');
        uploadedDoc = { url: res.url, name: res.name };
      } catch (err) {
        console.warn('Storage upload note:', err);
      }
    }

    try {
      const notesLines: string[] = [];
      if (formData.jobTitle) notesLines.push(`Title: ${formData.jobTitle}`);
      if (formData.dietaryNotes) notesLines.push(`Dietary/Notes: ${formData.dietaryNotes}`);
      if (isCorporatePack) {
        notesLines.push(
          `Delegates: 1. ${delegate1Name} (${delegate1Email || formData.email}) | 2. ${delegate2Name} (${delegate2Email || formData.email}) | 3. ${delegate3Name} (${delegate3Email || formData.email})`
        );
      }

      const delegateNames = isCorporatePack
        ? [delegate1Name || formData.fullName, delegate2Name || 'Delegate 2', delegate3Name || 'Delegate 3']
        : [formData.fullName];
      const delegateEmails = isCorporatePack
        ? [delegate1Email || formData.email, delegate2Email || formData.email, delegate3Email || formData.email]
        : [formData.email];

      setSubmitError(null);
      const regId = await submitRegistration({
        type: 'delegate',
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        passOrTier: selectedTier.name,
        notes: notesLines.join('\n'),
        attachmentUrl: uploadedDoc?.url,
        attachmentName: uploadedDoc?.name || (attachmentFile ? attachmentFile.name : undefined),
        delegateNames,
        delegateEmails,
        referenceNumber: formData.referenceNumber.trim(),
      });

      setSubmitSuccessId(regId);
    } catch (err) {
      console.error('Delegate registration error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save registration to Cloud Firestore.';
      setSubmitError(`Registration failed: ${msg}. Please check your connection and try again.`);
    } finally {
      setIsSubmitting(false);
      setUploadStatus(null);
    }
  };

  const handleResetAndClose = () => {
    setSubmitSuccessId(null);
    setSubmitError(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      jobTitle: '',
      dietaryNotes: '',
    });
    setDelegate1Name('');
    setDelegate1Email('');
    setDelegate2Name('');
    setDelegate2Email('');
    setDelegate3Name('');
    setDelegate3Email('');
    setAttachmentFile(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A1428]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0E1C38] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0A1428] via-[#112347] to-[#0A1428] px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F6DB5]/20 border border-[#2F6DB5]/30 flex items-center justify-center text-[#6AA5EE]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6AA5EE] font-bold">
                BMIC 2026 Registration
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
                Delegate Pass Reservation
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

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {submitSuccessId ? (
            /* Success State */
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white font-display">
                  Reservation Received!
                </h4>
                <p className="text-xs sm:text-sm text-[#B8C2D6] mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. Your reservation for <strong className="text-white">{selectedTier.name}</strong> has been logged with the Secretariat.
                </p>
                <div className="mt-3 inline-block font-mono text-xs text-[#6AA5EE] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  Reference: {submitSuccessId}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-[#0A1428] border border-[#2F6DB5]/30 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <CreditCard className="w-5 h-5 text-[#6AA5EE]" />
                  <span>Payment Methods:</span>
                </div>
                <div className="text-sm text-white font-mono space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6AA5EE] font-semibold">E-Wallet/Pay2Cell:</span>
                    <span className="font-bold tracking-tight">+26771843386</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6AA5EE] font-semibold">Orange Money:</span>
                    <span className="font-bold tracking-tight">+26772846420</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6AA5EE] font-semibold">Mascom MyZaka:</span>
                    <span className="font-bold tracking-tight">+26771843386</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{submitError}</span>
                </div>
              )}
              {/* Step 1: Select Delegate Tier */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  1. Select Delegate Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DELEGATE_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#182C56] border-[#D81B60] shadow-md ring-1 ring-[#D81B60]'
                            : 'bg-[#0A1428] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white text-xs leading-snug">
                            {tier.name}
                          </span>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            tier.isPopular ? 'bg-[#D81B60] text-white' : 'bg-white/10 text-slate-300'
                          }`}>
                            {tier.badge}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-white/5">
                          <div className="font-mono text-sm sm:text-base font-extrabold text-white">
                            {tier.price} <span className="text-[10px] text-[#6AA5EE]">BWP</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {tier.id === 'corporate-pack' ? '3 Passes' : '1 Pass'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Primary Registrant Information */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    2. Primary Delegate Details
                  </span>
                  <span className="text-[10px] text-[#6AA5EE] font-mono">
                    Official Badge Information
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Full Name <span className="text-[#D81B60]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Neo Ramosweu"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                    {errors.fullName && <p className="text-[10px] text-red-400 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Business Email <span className="text-[#D81B60]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="neo@enterprise.co.bw"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Direct Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+267 7X XXX XXX"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Company / Ministry / Institution
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="Company name for badge"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>
                  </div>

                  {/* Job Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Designation / Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="e.g. Chief Technology Officer / Managing Director"
                      className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                  {/* Reference Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Payment Reference Number (Bank/E-Wallet Ref)
                    </label>
                    <input
                      type="text"
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                      placeholder="e.g. Transaction ID / Reference"
                      className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Multi-Delegate Pack Expansion if Selected */}
              {isCorporatePack && (
                <div className="bg-[#0A1428] rounded-2xl p-4 border border-[#2F6DB5]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Users className="w-4 h-4 text-[#6AA5EE]" />
                    <span>Corporate 3-Pack: Delegate Names</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Provide the names of the 3 executives who will attend under this corporate allocation:
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={delegate1Name}
                        onChange={(e) => setDelegate1Name(e.target.value)}
                        placeholder="Delegate 1 Full Name *"
                        className="px-3 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                      />
                      <input
                        type="email"
                        value={delegate1Email}
                        onChange={(e) => setDelegate1Email(e.target.value)}
                        placeholder="Delegate 1 Email (optional)"
                        className="px-3 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    {errors.delegate1Name && <p className="text-[10px] text-red-400">{errors.delegate1Name}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={delegate2Name}
                        onChange={(e) => setDelegate2Name(e.target.value)}
                        placeholder="Delegate 2 Full Name *"
                        className="px-3 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                      />
                      <input
                        type="email"
                        value={delegate2Email}
                        onChange={(e) => setDelegate2Email(e.target.value)}
                        placeholder="Delegate 2 Email (optional)"
                        className="px-3 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    {errors.delegate2Name && <p className="text-[10px] text-red-400">{errors.delegate2Name}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={delegate3Name}
                        onChange={(e) => setDelegate3Name(e.target.value)}
                        placeholder="Delegate 3 Full Name *"
                        className="px-3 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                      />
                      <input
                        type="email"
                        value={delegate3Email}
                        onChange={(e) => setDelegate3Email(e.target.value)}
                        placeholder="Delegate 3 Email (optional)"
                        className="px-3 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    {errors.delegate3Name && <p className="text-[10px] text-red-400">{errors.delegate3Name}</p>}
                  </div>
                </div>
              )}

              {/* Step 4: Purchase Order or Document Attachment */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Proof of Payment, Purchase Order (PO) or Student ID (Optional)
                </label>
                <div className="relative border border-dashed border-white/20 hover:border-[#2F6DB5] rounded-xl p-3.5 text-center bg-[#0A1428] transition-colors">
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
                    <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                      <FileCheck className="w-4 h-4" />
                      <span className="truncate max-w-xs">{attachmentFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                      <Paperclip className="w-4 h-4 text-[#2F6DB5]" />
                      <span>Attach PDF / Image / PO document (Max 10MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dietary and Special Requirements */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Dietary Preferences or Special Requests
                </label>
                <input
                  type="text"
                  value={formData.dietaryNotes}
                  onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                  placeholder="e.g. Vegetarian / Halaal / Wheelchair access"
                  className="w-full px-3 py-2 text-xs bg-[#0A1428] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Total Payable</div>
                  <div className="text-xl sm:text-2xl font-black text-white font-display">
                    {selectedTier.price} <span className="text-xs font-mono text-[#6AA5EE]">BWP</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#D81B60] hover:bg-[#c2185b] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadStatus || 'Processing Reservation...'}</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Delegate Reservation</span>
                      <ArrowRight className="w-4 h-4" />
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
