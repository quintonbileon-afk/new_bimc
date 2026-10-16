import React, { useState, useEffect } from 'react';
import {
  RegistrationRecord,
  TicketRecord,
  subscribeToRegistrations,
  subscribeToAllTickets,
  updateRegistrationStatus,
  updateRegistrationRecord,
  deleteRegistrationRecord,
  submitRegistration,
  generateTicketsForBooking,
  updateTicketStatus,
  updateBookingDelegateNames,
  adminSignInWithGoogle,
  adminSignInAnonymously,
  adminSignOut,
  subscribeToAdminAuth,
} from '../firebase';
import { TicketCard } from './TicketCard';
import {
  X,
  Search,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  Lock,
  LogOut,
  RefreshCw,
  Plus,
  Mail,
  Phone,
  Building,
  DollarSign,
  Users,
  ShieldCheck,
  Paperclip,
  Check,
  Ticket,
  Edit3,
  Eye,
  EyeOff,
  KeyRound,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  // Secretariat Access Code authentication
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bmic_secretariat_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');

  // Real-time tickets across all bookings
  const [allTickets, setAllTickets] = useState<TicketRecord[]>([]);
  const [generatingForId, setGeneratingForId] = useState<string | null>(null);
  const [corpDelegateNames, setCorpDelegateNames] = useState<Record<string, [string, string, string]>>({});

  // Row-level inline admin notes state
  const [rowNotes, setRowNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [savedNoteSuccessId, setSavedNoteSuccessId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Ticket Pass Preview modal
  const [viewingTicket, setViewingTicket] = useState<TicketRecord | null>(null);

  // Expand / Collapse state per row (default is all open to show full details!)
  const [collapsedRowIds, setCollapsedRowIds] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);

  // Subscribe to real-time tickets when console is unlocked
  useEffect(() => {
    if (!isOpen || !isUnlocked) return;
    const unsubTickets = subscribeToAllTickets(
      (tickets) => setAllTickets(tickets),
      (err) => console.warn('Tickets subscription note:', err)
    );
    return () => unsubTickets();
  }, [isOpen, isUnlocked]);

  // Ticket generation handler directly on each record row
  const handleGenerateTicketsForRow = async (reg: RegistrationRecord) => {
    setGeneratingForId(reg.id);
    try {
      const isCorpPack =
        reg.passOrTier.toLowerCase().includes('corporate pack') ||
        reg.passOrTier.toLowerCase().includes('3 delegates');

      let delegateDetails: { name: string; email?: string }[] = [];
      if (isCorpPack) {
        const customNames = corpDelegateNames[reg.id] || [
          reg.delegateNames?.[0] || reg.fullName,
          reg.delegateNames?.[1] || 'Delegate 2',
          reg.delegateNames?.[2] || 'Delegate 3',
        ];
        delegateDetails = [
          { name: customNames[0] || reg.fullName, email: reg.email },
          { name: customNames[1] || 'Delegate 2', email: reg.email },
          { name: customNames[2] || 'Delegate 3', email: reg.email },
        ];
        await updateBookingDelegateNames(reg.id, customNames, [reg.email, reg.email, reg.email]);
      } else {
        delegateDetails = [{ name: reg.fullName, email: reg.email }];
      }

      const tks = await generateTicketsForBooking(reg, delegateDetails);
      setAllTickets((prev) => [...tks, ...prev.filter((t) => t.bookingId !== reg.id)]);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === reg.id ? { ...r, status: 'Payment verified' } : r))
      );
    } catch (err) {
      console.error('Ticket generation error:', err);
      alert('Error generating tickets. Please check database permissions.');
    } finally {
      setGeneratingForId(null);
    }
  };

  const handleToggleTicketCheckIn = async (ticket: TicketRecord) => {
    const newStatus = ticket.status === 'Checked in' ? 'Valid' : 'Checked in';
    setAllTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: newStatus } : t))
    );
    if (viewingTicket?.id === ticket.id) {
      setViewingTicket({ ...viewingTicket, status: newStatus });
    }
    try {
      await updateTicketStatus(ticket.id, newStatus);
    } catch (err) {
      console.error('Failed to update ticket check-in:', err);
    }
  };

  const handleSaveRowNote = async (id: string, currentStatus: RegistrationRecord['status']) => {
    const noteText = rowNotes[id] ?? '';
    setSavingNoteId(id);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, adminNotes: noteText, updatedAt: new Date().toISOString() } : r))
    );
    try {
      await updateRegistrationStatus(id, currentStatus, noteText);
      setSavedNoteSuccessId(id);
      setTimeout(() => {
        setSavedNoteSuccessId((prev) => (prev === id ? null : prev));
      }, 2500);
    } catch (err) {
      console.warn('Note save notice:', err);
    } finally {
      setSavingNoteId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Record Editing State
  const [editingRecord, setEditingRecord] = useState<RegistrationRecord | null>(null);
  const [editForm, setEditForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    organization: string;
    passOrTier: string;
    status: RegistrationRecord['status'];
    notes: string;
    delegateNames: string[];
  }>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    passOrTier: '',
    status: 'pending',
    notes: '',
    delegateNames: ['', '', ''],
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleOpenEdit = (reg: RegistrationRecord) => {
    const delNames = reg.delegateNames && reg.delegateNames.length > 0
      ? reg.delegateNames
      : [reg.fullName, '', ''];
    setEditingRecord(reg);
    setEditForm({
      fullName: reg.fullName || '',
      email: reg.email || '',
      phone: reg.phone || '',
      organization: reg.organization || '',
      passOrTier: reg.passOrTier || 'Standard Delegate Pass',
      status: reg.status,
      notes: reg.notes || '',
      delegateNames: [delNames[0] || '', delNames[1] || '', delNames[2] || ''],
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      alert('Please provide full name and email address.');
      return;
    }
    setIsSavingEdit(true);
    try {
      const isCorpPack = editForm.passOrTier.toLowerCase().includes('corporate pack') || editForm.passOrTier.toLowerCase().includes('3 delegates');
      const updates: Partial<Omit<RegistrationRecord, 'id'>> = {
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim() || undefined,
        organization: editForm.organization.trim() || undefined,
        passOrTier: editForm.passOrTier,
        status: editForm.status,
        notes: editForm.notes.trim() || undefined,
      };

      if (isCorpPack) {
        updates.delegateNames = [
          editForm.delegateNames[0]?.trim() || editForm.fullName.trim(),
          editForm.delegateNames[1]?.trim() || 'Delegate 2',
          editForm.delegateNames[2]?.trim() || 'Delegate 3',
        ];
        updates.delegateEmails = [editForm.email.trim(), editForm.email.trim(), editForm.email.trim()];
      }

      await updateRegistrationRecord(editingRecord.id, updates);

      setRegistrations((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
      );
      setEditingRecord(null);
    } catch (err) {
      console.error('Error saving record edit:', err);
      alert('Failed to update registration record.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Manual creation form
  const [manualForm, setManualForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    passOrTier: 'Corporate Delegate',
    notes: '',
  });
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  // Accepted Secretariat Access Codes
  const VALID_ACCESS_CODES = ['BMIC2026', 'bmic2026', 'BMICADMIN', 'bmicadmin'];

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = subscribeToAdminAuth((user) => {
      if (user) {
        setIsUnlocked(true);
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to real-time registrations from Firestore when modal is open and unlocked
  useEffect(() => {
    if (!isOpen || !isUnlocked) return;

    setIsLoading(true);
    setLoadError(null);
    const unsubscribeSnapshot = subscribeToRegistrations(
      (data) => {
        setRegistrations(data);
        setIsLoading(false);
        setLoadError(null);
      },
      (err) => {
        console.error('Firestore live subscription error:', err);
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : 'Database permission check';
        setLoadError(msg);
      }
    );

    return () => unsubscribeSnapshot();
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = accessCode.trim();
    if (VALID_ACCESS_CODES.includes(trimmed)) {
      try {
        await adminSignInAnonymously();
      } catch (err) {
        console.warn('Anonymous auth note:', err);
      }
      setIsUnlocked(true);
      try {
        sessionStorage.setItem('bmic_secretariat_unlocked', 'true');
      } catch (err) {
        console.warn('Could not save session:', err);
      }
      setAuthError(null);
    } else {
      setAuthError('Invalid Access Code. Please enter the official Secretariat Access Code (e.g. BMIC2026).');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await adminSignInWithGoogle();
      setIsUnlocked(true);
      try {
        sessionStorage.setItem('bmic_secretariat_unlocked', 'true');
      } catch (err) {
        console.warn('Could not save session:', err);
      }
      setAuthError(null);
    } catch (err) {
      console.warn('Google sign in error:', err);
      setAuthError('Google Sign-In was cancelled or failed. Please use the Secretariat Access Code (BMIC2026).');
    }
  };

  const handleLockConsole = async () => {
    try {
      await adminSignOut();
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem('bmic_secretariat_unlocked');
    } catch (err) {
      console.warn('Could not clear session:', err);
    }
    setAccessCode('');
  };

  const handleStatusChange = async (id: string, newStatus: RegistrationRecord['status']) => {
    // Immediate optimistic state update
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r))
    );

    try {
      await updateRegistrationStatus(id, newStatus);
    } catch (err) {
      console.warn('Status update sync:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove registration for "${name}" from the management console?`)) {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      try {
        await deleteRegistrationRecord(id);
      } catch (err) {
        console.warn('Delete sync:', err);
      }
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !manualForm.email.trim()) {
      alert('Name and email are required');
      return;
    }
    setIsCreatingManual(true);
    try {
      await submitRegistration({
        fullName: manualForm.fullName,
        email: manualForm.email,
        phone: manualForm.phone,
        organization: manualForm.organization,
        passOrTier: manualForm.passOrTier,
        notes: manualForm.notes,
      });
      setManualForm({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        passOrTier: 'Corporate Delegate',
        notes: '',
      });
      setActiveTab('list');
      alert('Manual registration successfully logged to database.');
    } catch (err) {
      console.error('Manual submission error:', err);
      alert('Error saving record.');
    } finally {
      setIsCreatingManual(false);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (registrations.length === 0) {
      alert('No records to export');
      return;
    }
    const headers = ['ID', 'Date', 'Full Name', 'Email', 'Phone', 'Organization', 'Package / Tier', 'Status', 'Registrant Notes', 'Secretariat Notes'];
    const rows = registrations.map((r) => [
      r.id,
      r.createdAt,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.organization || '').replace(/"/g, '""')}"`,
      `"${r.passOrTier.replace(/"/g, '""')}"`,
      r.status,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BMIC_2026_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.organization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.passOrTier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.referenceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || reg.status === selectedStatus;
    const matchesPackage = selectedPackage === 'all' || reg.passOrTier === selectedPackage;

    return matchesSearch && matchesStatus && matchesPackage;
  });

  // Calculate statistics
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;
  const confirmedCount = registrations.filter((r) => r.status === 'confirmed' || r.status === 'approved').length;

  const calculateRevenue = () => {
    let sum = 0;
    registrations.forEach((r) => {
      if (r.status === 'cancelled') return;
      const tier = r.passOrTier.toLowerCase();
      if (tier.includes('headline')) sum += 150000;
      else if (tier.includes('track') || tier.includes('transformation') || tier.includes('trust') || tier.includes('monetisation') || tier.includes('tech for good')) sum += 50000;
      else if (tier.includes('exhibition stand')) sum += 10000;
      else if (tier.includes('pack') || tier.includes('3 delegates')) sum += 5000;
      else if (tier.includes('corporate delegate')) sum += 2500;
      else if (tier.includes('standard delegate')) sum += 1500;
      else if (tier.includes('student') || tier.includes('developer')) sum += 950;
    });
    return sum;
  };

  const estimatedRevenue = calculateRevenue();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#050B14]/85 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full ${
          isUnlocked ? 'max-w-[1440px] h-[94vh]' : 'max-w-md sm:max-w-lg'
        } bg-[#0A1428] text-white rounded-2xl shadow-2xl border border-white/15 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Top Header Bar */}
        <div className="bg-[#070D18] px-5 sm:px-7 py-3.5 sm:py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2F6DB5]/20 text-[#6AA5EE] border border-[#2F6DB5]/30 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] text-[#6AA5EE] font-bold uppercase tracking-wider">
                  BMIC 2026 Secretariat Console
                </span>
                {isUnlocked && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold inline-flex items-center gap-1.5 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">Live Cloud Sync</span>
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Registration &amp; Delegate Management
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {isUnlocked && (
              <>
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="font-mono text-[11px] px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    <strong className="text-white">{registrations.length}</strong> Records
                  </span>
                  <span className="font-mono text-[11px] px-3 py-1 rounded-lg bg-[#2F6DB5]/15 border border-[#2F6DB5]/30 text-[#82B1FF]">
                    P{estimatedRevenue.toLocaleString()} Pipeline
                  </span>
                </div>

                <button
                  onClick={handleLockConsole}
                  className="text-xs text-rose-300 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 cursor-pointer transition-colors"
                  title="Lock Secretariat Console"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-medium">Lock Console</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lock / Auth Gate */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-8 overflow-y-auto">
            <div className="w-full text-center space-y-6">
              <div className="w-14 h-14 bg-[#2F6DB5]/15 text-[#6AA5EE] border border-[#2F6DB5]/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="w-7 h-7" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#6AA5EE] bg-[#2F6DB5]/10 border border-[#2F6DB5]/25 py-1 px-3 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6AA5EE] animate-pulse" />
                  <span>Cloud Firestore Sync Active</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">
                  Secretariat Access Gate
                </h3>
                <p className="text-xs text-[#B8C2D6] leading-relaxed max-w-sm mx-auto">
                  Confidential congress administration portal. Enter your Secretariat Access Code to manage registrations, verify payments, and issue badges across all devices.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs text-left flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Secretariat Access Code Form */}
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <input
                    type={showAccessCode ? 'text' : 'password'}
                    placeholder="Enter access code (e.g. BMIC2026)..."
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-3 pr-11 text-xs bg-[#0E1C38] border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5] focus:ring-1 focus:ring-[#2F6DB5] font-mono tracking-wider shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(!showAccessCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    title={showAccessCode ? 'Hide access code' : 'Show access code'}
                  >
                    {showAccessCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#2F6DB5] hover:bg-[#255892] shadow-lg shadow-[#2F6DB5]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock with Access Code</span>
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase">Or Authenticate With</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google Account</span>
              </button>

              <div className="pt-3 border-t border-white/10 text-[11px] text-[#B8C2D6] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Default Secretariat Code: <strong className="text-white font-mono">BMIC2026</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* Main Admin Workspace */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0A1428]">
            {/* Top Toolbar: Tabs + Summary Stats + Actions */}
            <div className="px-5 sm:px-7 py-3 border-b border-white/10 bg-[#070D18]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs font-medium bg-[#0E1C38] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'list'
                      ? 'bg-[#2F6DB5] text-white font-semibold shadow-sm'
                      : 'text-[#B8C2D6] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Delegates &amp; Bookings</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${activeTab === 'list' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>
                    {registrations.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'add'
                      ? 'bg-[#2F6DB5] text-white font-semibold shadow-sm'
                      : 'text-[#B8C2D6] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Reservation</span>
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'stats'
                      ? 'bg-[#2F6DB5] text-white font-semibold shadow-sm'
                      : 'text-[#B8C2D6] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Financial &amp; Analytics</span>
                </button>
              </div>

              {/* Action Buttons & Summary */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F6DB5] hover:bg-[#255892] text-white shadow-md shadow-[#2F6DB5]/20 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Sub-view: List & Manage — Full Width Rows with Full Details */}
            {activeTab === 'list' && (
              <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0A1428]">
                {/* Search, Filter & Action Toolbar */}
                <div className="p-3 sm:p-4 border-b border-white/10 flex flex-wrap items-center gap-2.5 shrink-0 bg-[#0E1C38]/90">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search name, email, organization, pass or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-8 py-2 text-xs bg-[#0A1428] border border-white/15 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5] focus:ring-1 focus:ring-[#2F6DB5] transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 text-xs bg-[#0A1428] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5] cursor-pointer"
                  >
                    <option value="all">All Statuses ({registrations.length})</option>
                    <option value="pending">Pending ({registrations.filter((r) => r.status === 'pending').length})</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="confirmed">Confirmed / Paid</option>
                    <option value="Payment verified">Payment Verified</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="px-3 py-2 text-xs bg-[#0A1428] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5] cursor-pointer max-w-[210px] truncate"
                  >
                    <option value="all">All Pass Tiers</option>
                    <option value="Free Pass for Exhibition Floor">Free Exhibition Floor Pass</option>
                    <option value="Standard Delegate">Standard Delegate (P1,500)</option>
                    <option value="Corporate Delegate">Corporate Delegate (P2,500)</option>
                    <option value="Corporate Pack (3 Delegates)">Corporate 3-Pack (P5,000)</option>
                    <option value="Student / Developer">Student / Dev (P950)</option>
                    <option value="Exhibition Stand">Exhibition Stand (P10,000)</option>
                    <option value="Headline Sponsor">Headline Sponsor (P150,000)</option>
                    <option value="AI & Digital Transformation Track">AI Track Sponsor (P50,000)</option>
                    <option value="Cybersecurity & Digital Trust Track">Cybersecurity Track (P50,000)</option>
                    <option value="Digital Content Monetisation Track">Content Monetisation Track (P50,000)</option>
                    <option value="Tech for Good Track">Tech for Good Track (P50,000)</option>
                  </select>

                  {/* Expand / Collapse All Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !allCollapsed;
                      setAllCollapsed(nextState);
                      const updated: Record<string, boolean> = {};
                      filteredRegistrations.forEach((r) => {
                        updated[r.id] = nextState;
                      });
                      setCollapsedRowIds(updated);
                    }}
                    className="px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    title={allCollapsed ? 'Expand full details for all rows' : 'Collapse all rows to compact summary'}
                  >
                    {allCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    <span>{allCollapsed ? 'Expand All' : 'Collapse All'}</span>
                  </button>

                  {(searchQuery || selectedStatus !== 'all' || selectedPackage !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedStatus('all');
                        setSelectedPackage('all');
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}

                  <div className="ml-auto text-xs text-slate-400 font-medium whitespace-nowrap pl-2">
                    Showing <strong className="text-white font-mono">{filteredRegistrations.length}</strong> of{' '}
                    {registrations.length}
                  </div>
                </div>

                {/* Rows Container */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
                  {loadError && (
                    <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Firestore Notice: {loadError}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsLoading(true);
                          setLoadError(null);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Retry Sync
                      </button>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="p-16 text-center text-xs text-[#B8C2D6]">
                      <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-[#6AA5EE]" />
                      <span className="font-medium text-sm text-white block">Synchronizing live records...</span>
                      <span className="text-[11px] text-slate-400">Connecting to Cloud Firestore database</span>
                    </div>
                  ) : filteredRegistrations.length === 0 ? (
                    <div className="p-16 text-center text-xs text-[#B8C2D6] bg-[#070D18]/50 rounded-2xl border border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Search className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-white text-sm block mb-1">No bookings match your filter</span>
                      <span className="text-slate-400 text-xs">Try clearing search terms or status criteria</span>
                    </div>
                  ) : (
                    filteredRegistrations.map((reg) => {
                      const isCollapsed = Boolean(collapsedRowIds[reg.id]);
                      const regTickets = allTickets.filter((t) => t.bookingId === reg.id);
                      const isGeneratingThis = generatingForId === reg.id;
                      const isSavingThisNote = savingNoteId === reg.id;
                      const hasNoteSavedThis = savedNoteSuccessId === reg.id;
                      const isCorpPack =
                        reg.passOrTier.toLowerCase().includes('corporate pack') ||
                        reg.passOrTier.toLowerCase().includes('3 delegates');

                      const currentDelNames = corpDelegateNames[reg.id] || [
                        reg.delegateNames?.[0] || reg.fullName,
                        reg.delegateNames?.[1] || 'Delegate 2',
                        reg.delegateNames?.[2] || 'Delegate 3',
                      ];

                      const statusColor =
                        reg.status === 'confirmed' ||
                        reg.status === 'approved' ||
                        reg.status === 'Payment verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : reg.status === 'contacted'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : reg.status === 'cancelled' || reg.status === 'Rejected'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                      // Initials
                      const initials = (reg.fullName || 'BM')
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <div
                          key={reg.id}
                          className="bg-[#0D1934] border border-white/15 hover:border-white/25 rounded-2xl shadow-lg transition-all duration-200 overflow-hidden"
                        >
                          {/* Main Row Header */}
                          <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 bg-[#0A1428]/90">
                            {/* Left: Delegate identity, ID, timestamp */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2F6DB5] to-[#D81B60] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-bold text-white text-sm sm:text-base tracking-tight truncate">
                                    {reg.fullName}
                                  </h3>
                                  {reg.organization && (
                                    <span className="text-xs text-slate-300 font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hidden sm:inline-block truncate max-w-[200px]">
                                      {reg.organization}
                                    </span>
                                  )}
                                  {reg.attachmentUrl && (
                                    <a
                                      href={reg.attachmentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                                      title="View verified attachment"
                                    >
                                      <Paperclip className="w-3 h-3" />
                                      <span>Attachment</span>
                                    </a>
                                  )}
                                </div>
                                <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-mono mt-0.5">
                                  <span title="Booking ID" className="text-[#6AA5EE] bg-[#2F6DB5]/10 px-1.5 py-0.2 rounded border border-[#2F6DB5]/20">
                                    ID: {reg.id.substring(0, 8)}
                                  </span>
                                  <span>•</span>
                                  <span>{new Date(reg.createdAt).toLocaleDateString()}</span>
                                  <span>{new Date(reg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            </div>

                            {/* Middle: Package & Ticket Count Badge */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="px-3 py-1.5 rounded-xl bg-[#0E1C38] border border-white/10 text-xs">
                                <span className="text-[10px] text-slate-400 block uppercase font-medium">Package</span>
                                <span className="font-bold text-white block truncate max-w-[240px]">
                                  {reg.passOrTier}
                                </span>
                              </div>

                              {/* Live Tickets summary pill */}
                              {regTickets.length > 0 ? (
                                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
                                  <Ticket className="w-3.5 h-3.5 shrink-0" />
                                  <span className="font-bold">{regTickets.length} Pass(es) Issued</span>
                                </div>
                              ) : (
                                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 shrink-0" />
                                  <span>Pass Pending</span>
                                </div>
                              )}
                            </div>

                            {/* Right: Status Dropdown & Action Buttons */}
                            <div className="flex items-center gap-2 justify-end">
                              {/* Status Select */}
                              <select
                                value={reg.status}
                                onChange={(e) =>
                                  handleStatusChange(reg.id, e.target.value as RegistrationRecord['status'])
                                }
                                className={`text-xs font-semibold py-1.5 px-3 rounded-xl border cursor-pointer focus:outline-none transition-all ${statusColor}`}
                                title="Update Status"
                              >
                                <option value="pending" className="bg-[#0A1428] text-amber-300">Pending</option>
                                <option value="contacted" className="bg-[#0A1428] text-blue-300">Contacted</option>
                                <option value="approved" className="bg-[#0A1428] text-teal-300">Approved</option>
                                <option value="confirmed" className="bg-[#0A1428] text-emerald-300">Confirmed</option>
                                <option value="Payment verified" className="bg-[#0A1428] text-emerald-400">Payment verified</option>
                                <option value="Rejected" className="bg-[#0A1428] text-red-400">Rejected</option>
                                <option value="cancelled" className="bg-[#0A1428] text-red-400">Cancelled</option>
                              </select>

                              {/* Edit record */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(reg)}
                                className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                                title="Edit delegate information"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#6AA5EE]" />
                              </button>

                              {/* Delete record */}
                              <button
                                type="button"
                                onClick={() => handleDelete(reg.id, reg.fullName)}
                                className="p-2 rounded-xl text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Collapse / Expand Toggle */}
                              <button
                                type="button"
                                onClick={() =>
                                  setCollapsedRowIds((prev) => ({
                                    ...prev,
                                    [reg.id]: !prev[reg.id],
                                  }))
                                }
                                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                                title={isCollapsed ? 'Show full details' : 'Hide details'}
                              >
                                {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5 text-[#6AA5EE]" />}
                              </button>
                            </div>
                          </div>

                          {/* Full Record Details (Rendered on the same row) */}
                          {!isCollapsed && (
                            <div className="p-4 sm:p-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-5 bg-[#070E1C]/90">
                              {/* Column 1: Contact Information & Notes */}
                              <div className="space-y-3.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6AA5EE] flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" />
                                  <span>Delegate Dossier &amp; Contact</span>
                                </div>

                                <div className="space-y-2 text-xs bg-[#0A1428] p-3.5 rounded-xl border border-white/10">
                                  <div className="flex items-center justify-between text-[#B8C2D6]">
                                    <div className="flex items-center gap-2 truncate">
                                      <Mail className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
                                      <a href={`mailto:${reg.email}`} className="text-white hover:underline truncate">
                                        {reg.email}
                                      </a>
                                    </div>
                                    <button
                                      onClick={() => handleCopyText(reg.email, `email-${reg.id}`)}
                                      className="text-slate-400 hover:text-white p-1 text-[10px]"
                                      title="Copy email"
                                    >
                                      {copiedId === `email-${reg.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>

                                  <div className="flex items-center justify-between text-[#B8C2D6]">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
                                      {reg.phone ? (
                                        <a href={`tel:${reg.phone}`} className="text-white hover:underline">
                                          {reg.phone}
                                        </a>
                                      ) : (
                                        <span className="text-slate-500 italic">No phone logged</span>
                                      )}
                                    </div>
                                    {reg.phone && (
                                      <button
                                        onClick={() => handleCopyText(reg.phone || '', `phone-${reg.id}`)}
                                        className="text-slate-400 hover:text-white p-1 text-[10px]"
                                        title="Copy phone"
                                      >
                                        {copiedId === `phone-${reg.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-[#B8C2D6]">
                                    <Building className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
                                    <span className="text-white font-medium truncate">
                                      {reg.organization || 'Individual Attendee'}
                                    </span>
                                  </div>
                                  {reg.referenceNumber && (
                                    <div className="flex items-center gap-2 text-[#B8C2D6]">
                                      <FileCheck className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
                                      <span className="font-mono text-white text-[11px] bg-white/5 px-1.5 py-0.5 rounded">Ref: {reg.referenceNumber}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Registrant Notes */}
                                {reg.notes && (
                                  <div className="p-3 bg-[#0A1428] rounded-xl border border-white/10 text-xs">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                                      Registrant Requirements:
                                    </span>
                                    <p className="text-slate-300 leading-relaxed text-xs break-words">
                                      {reg.notes}
                                    </p>
                                  </div>
                                )}

                                {/* Storage Attachment */}
                                {reg.attachmentUrl && (
                                  <div className="p-3 bg-[#0A1428] rounded-xl border border-emerald-500/30 text-xs flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                      <span className="text-[10px] uppercase font-semibold text-emerald-400 block">
                                        Uploaded Document:
                                      </span>
                                      <span className="text-white font-medium text-xs truncate block">
                                        {reg.attachmentName || 'Payment Proof / Document'}
                                      </span>
                                    </div>
                                    <a
                                      href={reg.attachmentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>View File</span>
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Column 2: Congress Pass & Ticket Generation (MOVED TO THIS ROW) */}
                              <div className="space-y-3.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B9A] flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <Ticket className="w-3.5 h-3.5" />
                                    <span>Congress Passes &amp; QR Badges</span>
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {regTickets.length} Issued
                                  </span>
                                </div>

                                {regTickets.length > 0 ? (
                                  <div className="space-y-2.5">
                                    {regTickets.map((tkt) => (
                                      <div
                                        key={tkt.id}
                                        className="p-3 bg-[#0A1428] border border-white/10 rounded-xl space-y-2 text-xs"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-white truncate max-w-[170px]">
                                            {tkt.delegateName}
                                          </span>
                                          <span className="font-mono text-[10px] text-[#6AA5EE] bg-[#2F6DB5]/15 px-1.5 py-0.5 rounded border border-[#2F6DB5]/25">
                                            {tkt.passId}
                                          </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 gap-2">
                                          <button
                                            type="button"
                                            onClick={() => setViewingTicket(tkt)}
                                            className="flex-1 py-1.5 px-3 bg-[#2F6DB5] hover:bg-[#255892] text-white rounded-lg font-semibold text-[11px] text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                            <span>View Pass Card</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleToggleTicketCheckIn(tkt)}
                                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border ${
                                              tkt.status === 'Checked in'
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                                            }`}
                                            title="Click to toggle check-in status"
                                          >
                                            {tkt.status === 'Checked in' ? '✓ Checked In' : 'Check In'}
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="space-y-2.5 bg-[#0A1428] p-3.5 rounded-xl border border-white/10 text-xs">
                                    <span className="text-[11px] text-slate-300 font-medium block">
                                      No congress tickets generated yet.
                                    </span>

                                    {/* Corporate 3-Pack Delegate Inputs */}
                                    {isCorpPack && (
                                      <div className="space-y-1.5 pt-1">
                                        <span className="text-[10px] text-[#6AA5EE] font-bold block">
                                          Customize Names for 3 Delegates:
                                        </span>
                                        <input
                                          type="text"
                                          value={currentDelNames[0]}
                                          onChange={(e) =>
                                            setCorpDelegateNames({
                                              ...corpDelegateNames,
                                              [reg.id]: [e.target.value, currentDelNames[1], currentDelNames[2]],
                                            })
                                          }
                                          placeholder="Delegate 1 Name"
                                          className="w-full px-2.5 py-1.5 text-xs bg-[#070D18] border border-white/15 rounded-lg text-white"
                                        />
                                        <input
                                          type="text"
                                          value={currentDelNames[1]}
                                          onChange={(e) =>
                                            setCorpDelegateNames({
                                              ...corpDelegateNames,
                                              [reg.id]: [currentDelNames[0], e.target.value, currentDelNames[2]],
                                            })
                                          }
                                          placeholder="Delegate 2 Name"
                                          className="w-full px-2.5 py-1.5 text-xs bg-[#070D18] border border-white/15 rounded-lg text-white"
                                        />
                                        <input
                                          type="text"
                                          value={currentDelNames[2]}
                                          onChange={(e) =>
                                            setCorpDelegateNames({
                                              ...corpDelegateNames,
                                              [reg.id]: [currentDelNames[0], currentDelNames[1], e.target.value],
                                            })
                                          }
                                          placeholder="Delegate 3 Name"
                                          className="w-full px-2.5 py-1.5 text-xs bg-[#070D18] border border-white/15 rounded-lg text-white"
                                        />
                                      </div>
                                    )}

                                    {/* Generate Ticket Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleGenerateTicketsForRow(reg)}
                                      disabled={isGeneratingThis}
                                      className="w-full py-2.5 px-4 bg-[#D81B60] hover:bg-[#c2185b] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D81B60]/20 disabled:opacity-50 mt-1"
                                    >
                                      {isGeneratingThis ? (
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Ticket className="w-3.5 h-3.5" />
                                      )}
                                      <span>
                                        {reg.passOrTier.toLowerCase().includes('free pass') ||
                                        reg.passOrTier.toLowerCase().includes('exhibition floor')
                                          ? 'Approve & Generate Free Pass'
                                          : 'Verify Payment & Generate Ticket(s)'}
                                      </span>
                                    </button>
                                    <span className="text-[10px] text-slate-400 text-center block">
                                      Generates unique Pass ID &amp; scannable QR token in Firestore.
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Column 3: Secretariat Internal Notes & Status Updates */}
                              <div className="space-y-3.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                                  <span>Secretariat Internal Notes</span>
                                  {hasNoteSavedThis && (
                                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      Saved!
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-2 bg-[#0A1428] p-3.5 rounded-xl border border-white/10 text-xs">
                                  <textarea
                                    rows={3}
                                    value={rowNotes[reg.id] !== undefined ? rowNotes[reg.id] : reg.adminNotes || ''}
                                    onChange={(e) =>
                                      setRowNotes({
                                        ...rowNotes,
                                        [reg.id]: e.target.value,
                                      })
                                    }
                                    placeholder="Enter internal notes, invoice numbers, VIP protocol, dietary notes..."
                                    className="w-full p-2.5 text-xs bg-[#070D18] border border-white/15 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleSaveRowNote(reg.id, reg.status)}
                                    disabled={isSavingThisNote}
                                    className="w-full py-2 rounded-lg text-xs font-semibold bg-[#2F6DB5] hover:bg-[#255892] text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                                  >
                                    {isSavingThisNote ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : hasNoteSavedThis ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                    <span>{hasNoteSavedThis ? 'Note Saved' : 'Save Internal Note'}</span>
                                  </button>
                                </div>

                                {/* Quick Status Pill Toggles */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                    Quick Status Change:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {(['pending', 'contacted', 'approved', 'confirmed', 'cancelled'] as const).map(
                                      (st) => {
                                        const isCurrent = reg.status === st;
                                        return (
                                          <button
                                            key={st}
                                            type="button"
                                            onClick={() => handleStatusChange(reg.id, st)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer border ${
                                              isCurrent
                                                ? 'bg-[#2F6DB5] text-white border-[#2F6DB5] shadow'
                                                : 'bg-[#0A1428] hover:bg-white/10 text-slate-400 border-white/10'
                                            }`}
                                          >
                                            {st}
                                          </button>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Sub-view: Add Manual Reservation */}
            {activeTab === 'add' && (
              <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
                <div className="max-w-xl mx-auto bg-[#0A1428] border border-white/10 rounded-[12px] p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Manual Secretariat Entry
                    </h3>
                    <p className="text-xs text-[#B8C2D6]">
                      Directly record an offline, phone, or institutional delegation booking into the database.
                    </p>
                  </div>

                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#B8C2D6] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={manualForm.fullName}
                        onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                        placeholder="Delegate Name"
                        className="w-full px-3.5 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-full text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#B8C2D6] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={manualForm.email}
                        onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                        placeholder="delegate@organization.bw"
                        className="w-full px-3.5 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-full text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#B8C2D6] mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={manualForm.phone}
                          onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                          placeholder="+267 ..."
                          className="w-full px-3.5 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-full text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#B8C2D6] mb-1">
                          Organization
                        </label>
                        <input
                          type="text"
                          value={manualForm.organization}
                          onChange={(e) => setManualForm({ ...manualForm, organization: e.target.value })}
                          placeholder="Ministry or Entity"
                          className="w-full px-3.5 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-full text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#B8C2D6] mb-1">
                        Package / Rate Card Tier
                      </label>
                      <select
                        value={manualForm.passOrTier}
                        onChange={(e) => setManualForm({ ...manualForm, passOrTier: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-[#0E1C38] border border-white/10 rounded-full text-white"
                      >
                        <option value="Free Pass for Exhibition Floor">Free Pass for Exhibition Floor (Free)</option>
                        <option value="Standard Delegate">Standard Delegate (P1,500)</option>
                        <option value="Corporate Delegate">Corporate Delegate (P2,500)</option>
                        <option value="Corporate Pack (3 Delegates)">Corporate Pack (3 Delegates) (P5,000)</option>
                        <option value="Student / Developer">Student / Developer (P950)</option>
                        <option value="Headline Sponsor">Headline Sponsor (P150,000)</option>
                        <option value="AI & Digital Transformation Track">AI & Digital Transformation Track (P50,000)</option>
                        <option value="Cybersecurity & Digital Trust Track">Cybersecurity & Digital Trust Track (P50,000)</option>
                        <option value="Digital Content Monetisation Track">Digital Content Monetisation Track (P50,000)</option>
                        <option value="Tech for Good Track">Tech for Good Track (P50,000)</option>
                        <option value="Exhibition Stand">Exhibition Stand (P10,000)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#B8C2D6] mb-1">
                        Internal Notes
                      </label>
                      <textarea
                        rows={2}
                        value={manualForm.notes}
                        onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                        placeholder="Offline notes..."
                        className="w-full p-2 text-xs bg-[#0E1C38] border border-white/10 rounded-[8px] text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCreatingManual}
                      className="w-full py-3 bg-[#D81B60] hover:bg-[#c2185b] text-white font-semibold rounded-full text-xs transition-colors cursor-pointer"
                    >
                      {isCreatingManual ? 'Saving to Database...' : 'Record Reservation'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-view: Stats & Financial Breakdown */}
            {activeTab === 'stats' && (
              <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
                {/* 4 Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-[#0A1428] border border-white/10 rounded-[12px]">
                    <span className="text-xs text-slate-400 block mb-1">Total Bookings</span>
                    <div className="text-3xl font-bold text-white tabular-nums">{totalCount}</div>
                    <span className="text-[11px] text-[#2F6DB5] mt-1 block">Live in Firestore</span>
                  </div>

                  <div className="p-6 bg-[#0A1428] border border-white/10 rounded-[12px]">
                    <span className="text-xs text-slate-400 block mb-1">Confirmed / Approved</span>
                    <div className="text-3xl font-bold text-emerald-400 tabular-nums">{confirmedCount}</div>
                    <span className="text-[11px] text-slate-400 mt-1 block">{pendingCount} pending review</span>
                  </div>

                  <div className="p-6 bg-[#0A1428] border border-white/10 rounded-[12px]">
                    <span className="text-xs text-slate-400 block mb-1">Pipeline Revenue</span>
                    <div className="text-3xl font-bold text-white tabular-nums">P{estimatedRevenue.toLocaleString()}</div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Gross Pula value</span>
                  </div>

                  <div className="p-6 bg-[#0A1428] border border-white/10 rounded-[12px]">
                    <span className="text-xs text-slate-400 block mb-1">Target Capacity</span>
                    <div className="text-3xl font-bold text-[#2F6DB5] tabular-nums">250+</div>
                    <span className="text-[11px] text-slate-400 mt-1 block">High-profile delegates</span>
                  </div>
                </div>

                {/* Tiers Breakdown */}
                <div className="bg-[#0A1428] border border-white/10 rounded-[12px] p-6 space-y-4">
                  <h4 className="text-sm font-bold text-white">
                    Registration Distribution by Package
                  </h4>
                  <div className="space-y-3">
                    {[
                      'Free Pass for Exhibition Floor',
                      'Standard Delegate',
                      'Corporate Delegate',
                      'Corporate Pack (3 Delegates)',
                      'Student / Developer',
                      'Headline Sponsor',
                      'Exhibition Stand',
                    ].map((pkg) => {
                      const count = registrations.filter((r) => r.passOrTier === pkg).length;
                      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                      return (
                        <div key={pkg} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white font-medium">{pkg}</span>
                            <span className="text-[#B8C2D6] tabular-nums">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#2F6DB5] h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Delegate Record Modal */}
        {editingRecord && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-[#050B14]/90 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl bg-[#0D1934] rounded-2xl p-6 sm:p-7 border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#2F6DB5]/20 text-[#6AA5EE]">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Edit Delegate Record</h3>
                    <p className="text-[11px] text-slate-400 font-mono">ID: {editingRecord.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingRecord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#070D18] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#070D18] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#070D18] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Organization / Entity</label>
                    <input
                      type="text"
                      value={editForm.organization}
                      onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#070D18] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Booking Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as RegistrationRecord['status'] })}
                      className="w-full px-3.5 py-2.5 bg-[#070D18] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="Payment verified">Payment verified</option>
                      <option value="Rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Package / Tier</label>
                  <select
                    value={editForm.passOrTier}
                    onChange={(e) => setEditForm({ ...editForm, passOrTier: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#070D18] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                  >
                    <option value="Free Pass for Exhibition Floor">Free Pass for Exhibition Floor</option>
                    <option value="Standard Delegate">Standard Delegate (P1,500)</option>
                    <option value="Corporate Delegate">Corporate Delegate (P2,500)</option>
                    <option value="Corporate Pack (3 Delegates)">Corporate Pack (3 Delegates) (P5,000)</option>
                    <option value="Student / Developer">Student / Developer (P950)</option>
                    <option value="Exhibition Stand">Exhibition Stand (P10,000)</option>
                    <option value="Headline Sponsor">Headline Sponsor (P150,000)</option>
                    <option value="AI & Digital Transformation Track">AI Track Sponsor (P50,000)</option>
                    <option value="Cybersecurity & Digital Trust Track">Cybersecurity Track (P50,000)</option>
                    <option value="Digital Content Monetisation Track">Content Monetisation Track (P50,000)</option>
                    <option value="Tech for Good Track">Tech for Good Track (P50,000)</option>
                  </select>
                </div>

                {(editForm.passOrTier.toLowerCase().includes('corporate pack') || editForm.passOrTier.toLowerCase().includes('3 delegates')) && (
                  <div className="p-3.5 bg-[#070D18] border border-white/10 rounded-xl space-y-2">
                    <label className="block text-[#6AA5EE] font-bold text-xs">Names for 3 Corporate Delegates</label>
                    <input
                      type="text"
                      placeholder="Delegate 1 Name"
                      value={editForm.delegateNames[0] || ''}
                      onChange={(e) => setEditForm({ ...editForm, delegateNames: [e.target.value, editForm.delegateNames[1] || '', editForm.delegateNames[2] || ''] })}
                      className="w-full px-3 py-1.5 bg-[#0E1C38] border border-white/15 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Delegate 2 Name"
                      value={editForm.delegateNames[1] || ''}
                      onChange={(e) => setEditForm({ ...editForm, delegateNames: [editForm.delegateNames[0] || '', e.target.value, editForm.delegateNames[2] || ''] })}
                      className="w-full px-3 py-1.5 bg-[#0E1C38] border border-white/15 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Delegate 3 Name"
                      value={editForm.delegateNames[2] || ''}
                      onChange={(e) => setEditForm({ ...editForm, delegateNames: [editForm.delegateNames[0] || '', editForm.delegateNames[1] || '', e.target.value] })}
                      className="w-full px-3 py-1.5 bg-[#0E1C38] border border-white/15 rounded-lg text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Registrant / Offline Notes</label>
                  <textarea
                    rows={2}
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-[#070D18] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#2F6DB5]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
                    className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-5 py-2 rounded-xl bg-[#2F6DB5] hover:bg-[#255892] text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSavingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ticket View Modal */}
        {viewingTicket && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0A1428]/95 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl bg-[#0E1C38] rounded-[16px] p-6 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#2F6DB5]/20 text-[#6AA5EE]">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Congress Pass &amp; Digital Ticket</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Pass ID: {viewingTicket.passId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingTicket(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <TicketCard
                ticket={viewingTicket}
                onStatusChange={async (id, status) => {
                  await handleToggleTicketCheckIn({ ...viewingTicket, status });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
