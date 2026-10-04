import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/bmicContent';
import { HeaderDots } from './HeaderDots';
import { Phone, Globe, MapPin, Calendar, Building, Send, CheckCircle2 } from 'lucide-react';

interface GetInvolvedProps {
  onDownloadIcs: () => void;
  preselectedInterest?: string;
}

export const GetInvolved: React.FC<GetInvolvedProps> = ({ onDownloadIcs, preselectedInterest }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    email: '',
    phone: '',
    roleCategory: preselectedInterest || 'Delegate / Attendee',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <HeaderDots dotSize="sm" />
        </div>

        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#235A82] mb-2">
            Participation &amp; Registration
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            GET INVOLVED
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Connect directly with the organisers at Continental Media Group to secure delegate participation, exhibition presence, or sponsorship alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Official Information Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#163B57] to-[#235A82] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-sky-300 mb-2 font-semibold">
                Official Event Secretariat
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">
                {EVENT_DETAILS.name}
              </h3>
              <p className="text-sky-100 text-sm leading-relaxed mb-8">
                {EVENT_DETAILS.tagline}
              </p>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-sky-200 uppercase font-semibold">Event Date</div>
                    <div className="font-semibold text-white">{EVENT_DETAILS.date}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-sky-200 uppercase font-semibold">Venue Location</div>
                    <div className="font-semibold text-white">{EVENT_DETAILS.venue}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-sky-200 uppercase font-semibold">Enquiries Hotline</div>
                    <a href="tel:+26771843386" className="font-mono font-bold text-white hover:underline">
                      {EVENT_DETAILS.enquiriesPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-sky-200 uppercase font-semibold">Official Website</div>
                    <div className="font-mono font-semibold text-white">{EVENT_DETAILS.website}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-sky-200 uppercase font-semibold">Organised By</div>
                    <div className="font-bold text-white">{EVENT_DETAILS.organiser}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-sky-600/50">
              <button
                onClick={onDownloadIcs}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#235A82] hover:bg-sky-50 rounded-lg text-xs font-bold transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#D81B60]" />
                <span>Save Date to Your Calendar (.ics)</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Enquiry Received
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                  Thank you, <strong>{formData.fullName}</strong>. The Continental Media Group secretariat has logged your enquiry for <strong>{formData.roleCategory}</strong> and will be in contact shortly.
                </p>
                <div className="text-xs text-slate-500 font-mono mb-6">
                  Direct line: {EVENT_DETAILS.enquiriesPhone}
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      organization: '',
                      email: '',
                      phone: '',
                      roleCategory: 'Delegate / Attendee',
                      message: '',
                    });
                  }}
                  className="text-xs text-[#235A82] font-bold hover:underline"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <h4 className="text-base font-bold text-slate-900">
                    Delegate &amp; Partner Expression of Interest
                  </h4>
                  <p className="text-xs text-slate-500">
                    Please provide your contact details to receive official Congress delegate passes, partnership briefs, or exhibition logistics.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Kgosi Molefe"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235A82]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Organization / Entity
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Ministry, ISP, Startup"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235A82]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@organization.bw"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235A82]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+267 ..."
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235A82]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Interest / Role
                  </label>
                  <select
                    value={formData.roleCategory}
                    onChange={(e) => setFormData({ ...formData, roleCategory: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235A82]"
                  >
                    <option value="Delegate / Attendee">Delegate / Attendee (Government, Industry, Academia, Creator)</option>
                    <option value="Headline Partner">Headline Partner (Keynote, Branding, Address, Premium Space)</option>
                    <option value="Track Sponsor">Track Sponsor (Cybersecurity, AI, Connectivity, Startups, Content)</option>
                    <option value="Exhibitor">Exhibitor (Branded Exhibition Presence)</option>
                    <option value="Media / Community Partner">Media / Community Partner</option>
                    <option value="Speaker">Prospective Speaker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Enquiries / Objective
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide any details regarding your delegation or partnership goals..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235A82]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#235A82] hover:bg-[#163B57] text-white rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Congress Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
