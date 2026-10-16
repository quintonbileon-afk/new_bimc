import React, { useState, useEffect } from 'react';
import {
  RegistrationRecord,
  TicketRecord,
  subscribeToRegistrations,
  updateRegistrationStatus,
  updateRegistrationRecord,
  deleteRegistrationRecord,
  submitRegistration,
  getTicketsForBooking,
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
  KeyRound
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  // Secretariat Access Code authentication (no Google login, universal Firestore sync)
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [saveNoteSuccess, setSaveNoteSuccess] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const [bookingTickets, setBookingTickets] = useState<TicketRecord[]>([]);
  const [isGeneratingTickets, setIsGeneratingTickets] = useState(false);
  const [editDelNames, setEditDelNames] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (selectedRecord) {
      getTicketsForBooking(selectedRecord.id).then((tks) => setBookingTickets(tks));
      const names = selectedRecord.delegateNames && selectedRecord.delegateNames.length > 0
        ? selectedRecord.delegateNames
        : [selectedRecord.fullName, '', ''];
      setEditDelNames([names[0] || '', names[1] || '', names[2] || '']);
    } else {
      setBookingTickets([]);
    }
  }, [selectedRecord]);

  const handleGenerateTickets = async () => {
    if (!selectedRecord) return;
    setIsGeneratingTickets(true);
    try {
      const isCorpPack = selectedRecord.passOrTier.toLowerCase().includes('corporate pack') || selectedRecord.passOrTier.toLowerCase().includes('3 delegates');

      let delegateDetails: { name: string; email?: string }[] = [];
      if (isCorpPack) {
        delegateDetails = [
          { name: editDelNames[0] || selectedRecord.fullName, email: selectedRecord.email },
          { name: editDelNames[1] || 'Delegate 2', email: selectedRecord.email },
          { name: editDelNames[2] || 'Delegate 3', email: selectedRecord.email },
        ];
        await updateBookingDelegateNames(
          selectedRecord.id,
          [editDelNames[0] || selectedRecord.fullName, editDelNames[1] || 'Delegate 2', editDelNames[2] || 'Delegate 3'],
          [selectedRecord.email, selectedRecord.email, selectedRecord.email]
        );
      } else {
        delegateDetails = [{ name: selectedRecord.fullName, email: selectedRecord.email }];
      }

      const tks = await generateTicketsForBooking(selectedRecord, delegateDetails);
      setBookingTickets(tks);
      setSelectedRecord((prev) => prev ? { ...prev, status: 'Payment verified' } : null);
      alert(`Successfully generated ${tks.length} ticket(s) for booking!`);
    } catch (err) {
      console.error('Ticket generation error:', err);
      alert('Error generating tickets.');
    } finally {
      setIsGeneratingTickets(false);
    }
  };

  const handleCheckInTicket = async (ticketId: string, status: 'Valid' | 'Checked in' | 'Cancelled') => {
    await updateTicketStatus(ticketId, status);
    setBookingTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status } : t));
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
      if (selectedRecord?.id === editingRecord.id) {
        setSelectedRecord((prev) => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
      }
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
    const unsubscribeSnapshot = subscribeToRegistrations(
      (data) => {
        setRegistrations(data);
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore live subscription error:', err);
        setIsLoading(false);
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
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => (prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null));
    }
    setStatusFeedback(`Status set to ${newStatus}`);
    setTimeout(() => setStatusFeedback(null), 2500);

    try {
      await updateRegistrationStatus(id, newStatus);
    } catch (err) {
      console.warn('Status update sync:', err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    // Immediate optimistic state update
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, adminNotes: adminNoteInput, updatedAt: new Date().toISOString() } : r))
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => (prev ? { ...prev, adminNotes: adminNoteInput, updatedAt: new Date().toISOString() } : null));
    }
    setSaveNoteSuccess(true);
    setTimeout(() => setSaveNoteSuccess(false), 2500);

    try {
      await updateRegistrationStatus(id, selectedRecord?.status || 'pending', adminNoteInput);
    } catch (err) {
      console.warn('Note save sync:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove registration for "${name}" from the management console?`)) {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
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
      reg.passOrTier.toLowerCase().includes(searchQuery.toLowerCase());

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

            {/* Sub-view: List & Manage */}
            {activeTab === 'list' && (
              <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                {/* Left Column: Filterable Table */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0A1428]">
                  {/* Search and Filters Bar */}
                  <div className="p-3 sm:p-4 border-b border-white/10 flex flex-wrap items-center gap-2.5 shrink-0 bg-[#0E1C38]/90">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search name, email, organization, pass..."
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
                      <option value="pending">Pending ({registrations.filter(r => r.status === 'pending').length})</option>
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
                      Showing <strong className="text-white font-mono">{filteredRegistrations.length}</strong> of {registrations.length}
                    </div>
                  </div>

                  {/* Registrations Table Container */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-16 text-center text-xs text-[#B8C2D6]">
                        <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-[#6AA5EE]" />
                        <span className="font-medium text-sm text-white block">Synchronizing live records...</span>
                        <span className="text-[11px] text-slate-400">Connecting to Cloud Firestore database</span>
                      </div>
                    ) : filteredRegistrations.length === 0 ? (
                      <div className="p-16 text-center text-xs text-[#B8C2D6]">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
                          <Search className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-white text-sm block mb-1">No bookings match your filter</span>
                        <span className="text-slate-400 text-xs">Try clearing search terms or status criteria</span>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#070D18] sticky top-0 border-b border-white/10 text-slate-400 uppercase text-[10px] font-bold tracking-wider z-10">
                          <tr>
                            <th className="py-3 px-4">Delegate</th>
                            <th className="py-3 px-3">Pass / Package</th>
                            <th className="py-3 px-3 hidden md:table-cell">Organization</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredRegistrations.map((reg) => {
                            const isSelected = selectedRecord?.id === reg.id;
                            const statusColor =
                              reg.status === 'confirmed' || reg.status === 'approved' || reg.status === 'Payment verified'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : reg.status === 'contacted'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : reg.status === 'cancelled' || reg.status === 'Rejected'
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                            // Get initials
                            const initials = (reg.fullName || 'BM')
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase();

                            return (
                              <tr
                                key={reg.id}
                                onClick={() => {
                                  setSelectedRecord(reg);
                                  setAdminNoteInput(reg.adminNotes || '');
                                }}
                                className={`cursor-pointer transition-colors border-l-4 ${
                                  isSelected
                                    ? 'bg-[#2F6DB5]/20 border-[#2F6DB5]'
                                    : 'border-transparent hover:bg-white/[0.04]'
                                }`}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2F6DB5] to-[#D81B60] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                      {initials}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-bold text-white flex items-center gap-1.5 truncate">
                                        <span>{reg.fullName}</span>
                                        {reg.attachmentUrl && (
                                          <span title="Contains verified attachment" className="text-emerald-400 shrink-0">
                                            <Paperclip className="w-3 h-3" />
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 truncate">
                                        {reg.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-3">
                                  <span className="font-semibold text-slate-200 block text-xs">
                                    {reg.passOrTier}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(reg.createdAt).toLocaleDateString()}
                                  </span>
                                </td>

                                <td className="py-3 px-3 hidden md:table-cell text-slate-300 max-w-[160px] truncate">
                                  {reg.organization || '—'}
                                </td>

                                <td className="py-3 px-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    <span>{reg.status}</span>
                                  </span>
                                </td>

                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <select
                                      value={reg.status}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(reg.id, e.target.value as RegistrationRecord['status']);
                                      }}
                                      className="text-[11px] font-semibold py-1 px-2 rounded-lg bg-[#0E1C38] border border-white/20 text-[#B8C2D6] focus:text-white focus:outline-none focus:border-[#2F6DB5] cursor-pointer"
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
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEdit(reg);
                                      }}
                                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                                      title="Edit delegate details"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-[#6AA5EE]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(reg.id, reg.fullName);
                                      }}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-white/10 cursor-pointer"
                                      title="Delete record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Right Column: Record Detail Inspector */}
                <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#070D18] p-5 sm:p-6 overflow-y-auto shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 shadow-xl">
                  {selectedRecord ? (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#6AA5EE] tracking-wider">
                            Delegate Detail
                          </span>
                          <h3 className="text-lg font-bold text-white mt-0.5">
                            {selectedRecord.fullName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            {selectedRecord.id.substring(0, 8)}...
                          </span>
                          <button
                            onClick={() => setSelectedRecord(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Close inspector"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2.5 text-xs bg-[#0E1C38]/60 p-3.5 rounded-[10px] border border-white/5">
                        <div className="flex items-center gap-2 text-[#B8C2D6]">
                          <Mail className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
                          <a href={`mailto:${selectedRecord.email}`} className="text-white hover:underline truncate">
                            {selectedRecord.email}
                          </a>
                        </div>
                        {selectedRecord.phone && (
                          <div className="flex items-center gap-2 text-[#B8C2D6]">
                            <Phone className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
                            <a href={`tel:${selectedRecord.phone}`} className="text-white hover:underline">
                              {selectedRecord.phone}
                            </a>
                          </div>
                        )}
                        {selectedRecord.organization && (
                          <div className="flex items-center gap-2 text-[#B8C2D6]">
                            <Building className="w-3.5 h-3.5 text-[#2F6DB5] shrink-0" />
                            <span>{selectedRecord.organization}</span>
                          </div>
                        )}
                      </div>

                      {/* Package Selection */}
                      <div className="p-3.5 bg-[#0E1C38] border border-white/10 rounded-[10px] text-xs space-y-1">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          Reserved Package
                        </div>
                        <div className="font-bold text-white text-sm">
                          {selectedRecord.passOrTier}
                        </div>
                        <div className="text-[11px] text-[#2F6DB5] flex items-center justify-between pt-1">
                          <span>Logged: {new Date(selectedRecord.createdAt).toLocaleDateString()}</span>
                          <span className="text-slate-400">{new Date(selectedRecord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Special Notes from Registrant */}
                      {selectedRecord.notes && (
                        <div>
                          <div className="text-[11px] uppercase font-semibold text-slate-400 mb-1">
                            Registrant Notes / Requirements:
                          </div>
                          <div className="p-3 bg-[#0E1C38] border border-white/10 rounded-[8px] text-xs text-[#B8C2D6] leading-relaxed break-words">
                            {selectedRecord.notes}
                          </div>
                        </div>
                      )}

                      {/* Attached Document from Firebase Storage */}
                      {selectedRecord.attachmentUrl && (
                        <div className="p-3 bg-[#0E1C38] border border-emerald-500/30 rounded-[10px] text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-semibold text-emerald-400 flex items-center gap-1.5">
                              <Paperclip className="w-3 h-3" />
                              Firebase Storage Attachment
                            </span>
                            <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">Verified</span>
                          </div>
                          <div className="text-white font-medium text-xs truncate">
                            {selectedRecord.attachmentName || 'Delegate Document'}
                          </div>
                          <a
                            href={selectedRecord.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download / View Attachment</span>
                          </a>
                        </div>
                      )}

                      {/* Ticket System Section */}
                      <div className="space-y-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase font-bold text-[#FF6B9A] tracking-wider flex items-center gap-1.5">
                            <Ticket className="w-3.5 h-3.5" />
                            Congress Passes &amp; Tickets
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {bookingTickets.length} Issued
                          </span>
                        </div>

                        {bookingTickets.length > 0 ? (
                          <div className="space-y-3">
                            <div className="text-[11px] text-emerald-400 font-medium">
                              Tickets generated and active in system:
                            </div>
                            {bookingTickets.map((tkt) => (
                              <div key={tkt.id} className="p-3 bg-[#0E1C38] border border-white/10 rounded-[10px] space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white">{tkt.delegateName}</span>
                                  <span className="font-mono text-[10px] text-[#6AA5EE]">{tkt.passId}</span>
                                </div>
                                <div className="text-[11px] text-slate-400">Tier: {tkt.tier}</div>
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    onClick={() => setSelectedRecord({ ...selectedRecord, _viewTicket: tkt } as any)}
                                    className="flex-1 py-1.5 bg-[#2F6DB5] hover:bg-[#255892] text-white rounded font-semibold text-[11px] text-center cursor-pointer"
                                  >
                                    View Pass Card
                                  </button>
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    tkt.status === 'Checked in' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {tkt.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedRecord.passOrTier.toLowerCase().includes('corporate pack') || selectedRecord.passOrTier.toLowerCase().includes('3 delegates') ? (
                              <div className="space-y-2 bg-[#0E1C38] p-3 rounded-[10px] border border-white/10">
                                <div className="text-[11px] text-slate-300 font-medium">Edit 3 Delegate Names before generating:</div>
                                <input
                                  type="text"
                                  value={editDelNames[0]}
                                  onChange={(e) => setEditDelNames([e.target.value, editDelNames[1], editDelNames[2]])}
                                  placeholder="Delegate 1 Name"
                                  className="w-full px-2.5 py-1.5 text-xs bg-[#0A1428] border border-white/10 rounded text-white"
                                />
                                <input
                                  type="text"
                                  value={editDelNames[1]}
                                  onChange={(e) => setEditDelNames([editDelNames[0], e.target.value, editDelNames[2]])}
                                  placeholder="Delegate 2 Name"
                                  className="w-full px-2.5 py-1.5 text-xs bg-[#0A1428] border border-white/10 rounded text-white"
                                />
                                <input
                                  type="text"
                                  value={editDelNames[2]}
                                  onChange={(e) => setEditDelNames([editDelNames[0], editDelNames[1], e.target.value])}
                                  placeholder="Delegate 3 Name"
                                  className="w-full px-2.5 py-1.5 text-xs bg-[#0A1428] border border-white/10 rounded text-white"
                                />
                              </div>
                            ) : null}

                            <button
                              type="button"
                              onClick={handleGenerateTickets}
                              disabled={isGeneratingTickets}
                              className="w-full py-3 bg-[#D81B60] hover:bg-[#c2185b] text-white rounded-full text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                            >
                              {isGeneratingTickets ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Ticket className="w-4 h-4" />
                              )}
                              <span>
                                {selectedRecord.passOrTier.toLowerCase().includes('free pass') || selectedRecord.passOrTier.toLowerCase().includes('exhibition floor')
                                  ? 'Approve and generate ticket'
                                  : 'Verify payment and generate ticket(s)'}
                              </span>
                            </button>
                            <div className="text-[10px] text-slate-400 text-center">
                              Generates Pass ID and scannable QR ticket(s) in database.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status Control */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] uppercase font-semibold text-slate-400 block">
                            Update Status
                          </label>
                          {statusFeedback && (
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {statusFeedback}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'pending', label: 'Pending', activeCls: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30' },
                            { key: 'contacted', label: 'Contacted', activeCls: 'bg-blue-500/20 text-blue-300 border-blue-500/40 ring-1 ring-blue-500/30' },
                            { key: 'approved', label: 'Approved', activeCls: 'bg-teal-500/20 text-teal-300 border-teal-500/40 ring-1 ring-teal-500/30' },
                            { key: 'confirmed', label: 'Confirmed', activeCls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30' },
                            { key: 'cancelled', label: 'Cancelled', activeCls: 'bg-red-500/20 text-red-300 border-red-500/40 ring-1 ring-red-500/30' },
                          ].map(({ key, label, activeCls }) => {
                            const isCurrent = selectedRecord.status === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handleStatusChange(selectedRecord.id, key as RegistrationRecord['status'])}
                                className={`py-2 px-3 rounded-[8px] text-xs font-semibold capitalize transition-all border cursor-pointer flex items-center justify-between ${
                                  isCurrent
                                    ? activeCls
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                                }`}
                              >
                                <span>{label}</span>
                                {isCurrent && <Check className="w-3 h-3 ml-1 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Internal Secretariat Notes */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] uppercase font-semibold text-slate-400 block">
                            Secretariat Internal Notes
                          </label>
                          {saveNoteSuccess && (
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Saved!
                            </span>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          value={adminNoteInput}
                          onChange={(e) => setAdminNoteInput(e.target.value)}
                          placeholder="e.g. Invoiced sent, VIP protocol requested, payment verified..."
                          className="w-full p-2.5 text-xs bg-[#0E1C38] border border-white/10 rounded-[8px] text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(selectedRecord.id)}
                          className={`w-full py-2.5 rounded-[8px] text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                            saveNoteSuccess
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#2F6DB5] hover:bg-[#255892] text-white'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{saveNoteSuccess ? 'Note Saved' : 'Save Internal Note'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-500 p-8 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-white text-sm">No Delegate Selected</div>
                      <p className="max-w-[200px] text-[11px] text-slate-400">
                        Click on any registration record in the list to view contact info, change status, or update notes.
                      </p>
                    </div>
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
        {(selectedRecord as any)?._viewTicket && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0A1428]/95 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl bg-[#0E1C38] rounded-[16px] p-6 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Congress Pass &amp; Ticket View</h3>
                <button
                  onClick={() => setSelectedRecord({ ...selectedRecord, _viewTicket: undefined } as any)}
                  className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <TicketCard
                ticket={(selectedRecord as any)._viewTicket}
                onStatusChange={async (id, status) => {
                  await handleCheckInTicket(id, status);
                  setSelectedRecord({
                    ...selectedRecord,
                    _viewTicket: { ...(selectedRecord as any)._viewTicket, status }
                  } as any);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
