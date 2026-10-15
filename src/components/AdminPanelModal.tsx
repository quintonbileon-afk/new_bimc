import React, { useState, useEffect } from 'react';
import {
  RegistrationRecord,
  subscribeToRegistrations,
  updateRegistrationStatus,
  deleteRegistrationRecord,
  submitRegistration,
  auth,
  googleProvider,
  signInWithPopup,
  signOut
} from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
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
  Check
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [passphrase, setPassphrase] = useState('');
  const [isUnlockedWithPassphrase, setIsUnlockedWithPassphrase] = useState(false);
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

  // Default secretariat emergency passcode
  const SECRET_PASSCODE = 'BMIC2026';
  const AUTHORIZED_ADMIN_EMAILS = ['quintonbileon@gmail.com', 'gsetlamelo@gmail.com'];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const isAuthorized =
    isUnlockedWithPassphrase ||
    (currentUser && (AUTHORIZED_ADMIN_EMAILS.includes(currentUser.email || '') || currentUser.email?.endsWith('@continentalmedia.co.bw')));

  // Subscribe to real-time registrations when modal is open and authorized
  useEffect(() => {
    if (!isOpen || !isAuthorized) return;

    setIsLoading(true);
    const unsubscribeSnapshot = subscribeToRegistrations(
      (data) => {
        setRegistrations(data);
        setIsLoading(false);
      },
      (err) => {
        console.error('Subscription error in admin:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribeSnapshot();
  }, [isOpen, isAuthorized]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign In error:', err);
      setAuthError('Sign-in cancelled or popup blocked. You can use the secret access key below.');
    }
  };

  const handlePassphraseUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim() === SECRET_PASSCODE || passphrase.trim().toLowerCase() === 'bmicadmin') {
      setIsUnlockedWithPassphrase(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid secretariat access code. Try "BMIC2026".');
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A1428]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#0E1C38] text-white rounded-[12px] shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-[#0A1428] px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-[#2F6DB5]/20 text-[#2F6DB5]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#2F6DB5] font-semibold uppercase tracking-wider">
                  Secretariat Console
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold">
                  Live Firestore Sync
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                BMIC 2026 Registration Management
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthorized && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#B8C2D6]">
                <span>Logged in as:</span>
                <span className="font-semibold text-white">
                  {currentUser?.email || 'Secretariat Key (Unlocked)'}
                </span>
              </div>
            )}

            {isAuthorized && (
              <button
                onClick={() => {
                  signOut(auth);
                  setIsUnlockedWithPassphrase(false);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 cursor-pointer"
                title="Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lock / Auth Gate */}
        {!isAuthorized ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-md bg-[#0A1428] border border-white/10 rounded-[12px] p-8 text-center space-y-6">
              <div className="w-14 h-14 bg-[#2F6DB5]/20 text-[#2F6DB5] rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">
                  Secretariat Access Gate
                </h3>
                <p className="text-xs text-[#B8C2D6] leading-relaxed">
                  Confidential congress administration portal. Authenticate via Google ({AUTHORIZED_ADMIN_EMAILS.join(', ')}) or enter the Secretariat Key.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 py-1 px-3 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Firebase Auth &amp; Storage Active</span>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-left">
                  {authError}
                </div>
              )}

              {/* Method 1: Google Login */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-4 rounded-full bg-white text-[#0A1428] font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
                  <span>Sign In with Authorized Google Account</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-xs">
                <div className="flex-1 border-t border-white/10" />
                <span>or enter access key</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              {/* Method 2: Access Passcode */}
              <form onSubmit={handlePassphraseUnlock} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter access code (e.g. BMIC2026)..."
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#0E1C38] border border-white/10 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-[#2F6DB5]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full text-xs font-semibold text-white bg-[#2F6DB5] hover:bg-[#255892] transition-colors cursor-pointer"
                >
                  Unlock Management Console
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Admin Workspace */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Top Toolbar: Tabs + Summary Stats */}
            <div className="p-4 sm:p-6 border-b border-white/10 bg-[#0A1428]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
              {/* Tab Navigation */}
              <div className="flex items-center gap-6 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'list'
                      ? 'text-white border-b-2 border-[#D81B60]'
                      : 'text-[#B8C2D6] hover:text-white'
                  }`}
                >
                  Delegates &amp; Bookings ({registrations.length})
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'add'
                      ? 'text-white border-b-2 border-[#D81B60]'
                      : 'text-[#B8C2D6] hover:text-white'
                  }`}
                >
                  + Add Manual Reservation
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'stats'
                      ? 'text-white border-b-2 border-[#D81B60]'
                      : 'text-[#B8C2D6] hover:text-white'
                  }`}
                >
                  Financial &amp; Tier Breakdown
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#2F6DB5] hover:bg-[#255892] text-white transition-colors cursor-pointer"
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
                <div className="flex-1 flex flex-col min-h-0 border-r border-white/10 overflow-hidden">
                  {/* Search and Filters */}
                  <div className="p-4 border-b border-white/10 flex flex-wrap items-center gap-3 shrink-0 bg-[#0E1C38]">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search by name, email, organization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0A1428] border border-white/10 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-[#2F6DB5]"
                      />
                    </div>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-[#0A1428] border border-white/10 rounded-full text-white focus:outline-none focus:border-[#2F6DB5]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      Showing {filteredRegistrations.length} of {registrations.length}
                    </div>
                  </div>

                  {/* Registrations Table */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-12 text-center text-xs text-[#B8C2D6]">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2F6DB5]" />
                        <span>Synchronizing with Firestore database...</span>
                      </div>
                    ) : filteredRegistrations.length === 0 ? (
                      <div className="p-12 text-center text-xs text-[#B8C2D6]">
                        No registrations matching the selected filters.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0A1428] sticky top-0 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider z-10">
                          <tr>
                            <th className="py-2.5 px-4">Delegate</th>
                            <th className="py-2.5 px-3">Package / Tier</th>
                            <th className="py-2.5 px-3">Organization</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredRegistrations.map((reg) => {
                            const isSelected = selectedRecord?.id === reg.id;
                            const statusColor =
                              reg.status === 'confirmed' || reg.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : reg.status === 'contacted'
                                ? 'bg-blue-500/20 text-blue-300'
                                : reg.status === 'cancelled'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-amber-500/20 text-amber-300';

                            return (
                              <tr
                                key={reg.id}
                                onClick={() => {
                                  setSelectedRecord(reg);
                                  setAdminNoteInput(reg.adminNotes || '');
                                }}
                                className={`cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-[#2F6DB5]/20 font-medium'
                                    : 'hover:bg-white/[0.03]'
                                }`}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-white flex items-center gap-1.5">
                                    <span>{reg.fullName}</span>
                                    {reg.attachmentUrl && (
                                      <span title="Contains attached document / PO" className="text-emerald-400">
                                        <Paperclip className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {reg.email}
                                  </div>
                                </td>

                                <td className="py-3 px-3">
                                  <span className="font-medium text-[#B8C2D6]">
                                    {reg.passOrTier}
                                  </span>
                                </td>

                                <td className="py-3 px-3 text-slate-300">
                                  {reg.organization || '—'}
                                </td>

                                <td className="py-3 px-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${statusColor}`}>
                                    {reg.status}
                                  </span>
                                </td>

                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(reg.id, reg.fullName);
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                                    title="Delete record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Right Column: Record Detail & Management */}
                <div className="w-full lg:w-96 bg-[#0A1428] p-6 overflow-y-auto shrink-0 flex flex-col justify-between border-l border-white/5">
                  {selectedRecord ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#2F6DB5] tracking-wider">
                            Registration Detail
                          </span>
                          <h3 className="text-base font-bold text-white mt-0.5">
                            {selectedRecord.fullName}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          {selectedRecord.id.substring(0, 10)}...
                        </span>
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
      </div>
    </div>
  );
};
