import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { TicketRecord } from '../firebase';
import { BmicLogo } from './BmicLogo';
import { Download, CheckCircle, ShieldCheck, Printer, Mail, Loader2 } from 'lucide-react';

interface TicketCardProps {
  ticket: TicketRecord;
  onStatusChange?: (ticketId: string, status: 'Valid' | 'Checked in' | 'Cancelled') => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onStatusChange }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const isMagentaTier = ticket.tier.toLowerCase().includes('corporate delegate') || ticket.tier.toLowerCase().includes('corp');
  const pillBg = isMagentaTier ? 'bg-[#E0245E] text-white' : 'bg-[#2F6FBA] text-white';
  const accentColor = isMagentaTier ? '#FF6B9A' : '#6AA5EE';

  // Exact access line per tier requested by user
  const getAccessLine = (tier: string) => {
    const t = tier.toLowerCase();
    if (t.includes('free pass') || t.includes('exhibition floor') || t.includes('exhibitor')) {
      return 'Exhibition floor';
    }
    if (t.includes('student') || t.includes('developer')) {
      return 'Builders and digital economy sessions, exhibition floor';
    }
    if (t.includes('standard')) {
      return 'All congress sessions, exhibition floor, networking breaks and luncheon';
    }
    if (t.includes('corporate delegate') || t.includes('gold') || t.includes('silver')) {
      return 'Full congress and exhibition, priority seating';
    }
    if (t.includes('corporate pack') || t.includes('team') || t.includes('3 delegates')) {
      return 'Full congress and exhibition, reserved company table';
    }
    return 'Full congress and exhibition, priority seating';
  };

  useEffect(() => {
    const verifyUrl = `${window.location.origin}/verify?token=${encodeURIComponent(ticket.token)}`;
    QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 220,
      color: {
        dark: '#0A1128',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [ticket.token]);

  const handleDownload = () => {
    // Create a canvas or export notification
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `BMIC-2026-Pass-${ticket.passId}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const bookingRefShort = ticket.bookingId ? ticket.bookingId.replace('reg_', '').toUpperCase() : 'BMIC2026';

  const [isEmailing, setIsEmailing] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const handleEmailPass = async () => {
    setIsEmailing(true);
    setEmailSentSuccess(false);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passId: ticket.passId,
          tier: ticket.tier,
          delegateName: ticket.delegateName,
          delegateEmail: ticket.delegateEmail || '',
          organizationName: ticket.organizationName || '',
          bookingId: ticket.bookingId || '',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSentSuccess(true);
        setTimeout(() => setEmailSentSuccess(false), 4000);
      } else {
        alert(data.error || 'Failed to send pass email.');
      }
    } catch (err) {
      console.error('Email pass error:', err);
      alert('Network error while sending pass email.');
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full my-4">
      {/* Landscape ticket card */}
      <div className="relative w-full max-w-[720px] bg-[#0A1128] border border-[#1F2D52] rounded-[16px] text-white shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Top/Bottom Perforation Notches on Desktop (left/right split) */}
        <div className="absolute top-0 right-[190px] w-6 h-6 rounded-full bg-[#0E1C38] border-b border-[#1F2D52] -translate-y-1/2 z-10 hidden md:block" />
        <div className="absolute bottom-0 right-[190px] w-6 h-6 rounded-full bg-[#0E1C38] border-t border-[#1F2D52] translate-y-1/2 z-10 hidden md:block" />

        {/* Left (Main) Part */}
        <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between relative">
          
          {/* Top row: Event Logo & Tier Pill */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <BmicLogo variant="compact" size="sm" />
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${pillBg}`}>
              {ticket.tier}
            </span>
          </div>

          {/* Date & Location row */}
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-[#8A97B8] mb-4">
            <span>30 OCTOBER 2026 · GABORONE, BOTSWANA</span>
          </div>

          {/* Delegate Name & Organization */}
          <div className="mb-5">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#8A97B8] mb-1">
              DELEGATE
            </div>
            <h4 className="text-2xl sm:text-[28px] font-medium text-white tracking-tight leading-tight">
              {ticket.delegateName}
            </h4>
            {ticket.organizationName && (
              <div className="text-[13px] text-[#9AA6C4] mt-1 font-normal">
                {ticket.organizationName}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#24366A] my-3" />

          {/* 2x2 Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#8A97B8]">VENUE</div>
              <div className="text-white font-medium mt-0.5">Royal Aria Conference Centre, Plenary Hall</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#8A97B8]">PASS ID</div>
              <div className="font-mono font-bold text-white mt-0.5 tracking-wider" style={{ color: accentColor }}>
                {ticket.passId}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#8A97B8]">ACCESS</div>
              <div className="text-white text-[11px] leading-snug mt-0.5 font-normal">
                {getAccessLine(ticket.tier)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#8A97B8]">BOOKING REF</div>
              <div className="font-mono text-white mt-0.5">#{bookingRefShort}</div>
            </div>
          </div>
        </div>

        {/* Dashed Perforation Line separator on desktop */}
        <div className="hidden md:flex flex-col justify-center items-center w-[2px] bg-transparent relative">
          <div className="h-full border-r-2 border-dashed border-[#3B4A78]" />
        </div>

        {/* Right (Stub) Part */}
        <div className="w-full md:w-[190px] bg-[#0D1736] p-6 flex flex-col items-center justify-between text-center border-t md:border-t-0 md:border-l border-[#1F2D52] shrink-0">
          
          <div className="font-mono text-[11px] font-bold tracking-widest text-[#FF6B9A] uppercase">
            ADMIT ONE
          </div>

          {/* QR Code Container with Center B Logo mark */}
          <div className="relative my-3 p-2 bg-white rounded-[12px] shadow-lg flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Ticket QR Code" className="w-[115px] h-[115px] block rounded-[8px]" />
            ) : (
              <div className="w-[115px] h-[115px] bg-slate-100 animate-pulse rounded-[8px]" />
            )}
            
            {/* Center B Logo mark tile */}
            <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#0A1128] border border-[#1F2D52] flex items-center justify-center shadow-md">
              <span className="text-[11px] font-extrabold text-[#FF2A7A]">B</span>
            </div>
          </div>

          <div className="w-full">
            <div className="text-[11px] text-white font-medium">Scan at registration</div>
            <div className="text-[10px] font-mono text-[#8A97B8] mt-1 truncate">
              {ticket.passId}
            </div>
            
            {/* Status Badge */}
            <div className={`mt-2 py-1 px-2 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
              ticket.status === 'Checked in' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              ticket.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
              'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            }`}>
              {ticket.status}
            </div>
          </div>
        </div>

      </div>

      {/* Ticket Action Toolbar */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-full bg-[#2F6DB5] hover:bg-[#255a96] text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Pass (PNG)</span>
        </button>

        <button
          onClick={handleEmailPass}
          disabled={isEmailing}
          className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          {isEmailing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending Pass...</span>
            </>
          ) : emailSentSuccess ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-white" />
              <span>Pass Emailed!</span>
            </>
          ) : (
            <>
              <Mail className="w-3.5 h-3.5" />
              <span>Email Pass</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
