export function generateIcsFile(): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Botswana Mobile & Internet Congress//BMIC 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:bmic-2026-gaborone@bmic.co.bw',
    'DTSTAMP:20261004T120000Z',
    'DTSTART:20261030T053000Z', // 07:30 Botswana CAT (UTC+2)
    'DTEND:20261030T163000Z',   // 18:30 Botswana CAT (UTC+2)
    'SUMMARY:Botswana Mobile & Internet Congress 2026 (BMIC 2026)',
    'DESCRIPTION:Transforming Botswana into the Digital Valley of SADC.\\n\\nOne national digital conversation - moving from policy and strategy to implementation, investment and measurable outcomes.\\n\\nOrganised by Continental Media Group.\\nEnquiries: +267 71 843 386\\nWebsite: www.bmic.co.bw',
    'LOCATION:Royal Aria Conference Centre\\, Gaborone\\, Botswana',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'BMIC_2026_Congress_Programme.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
