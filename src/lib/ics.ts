import { Match } from '@/types';

function formatDateToICS(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/**
 * Generates an RFC 5545 compliant iCalendar string for fixtures.
 */
export function generateICS(matches: Match[], calendarName = 'IU Sports Hub Schedule'): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Iqra University//IU Sports Hub v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarName}`,
    'X-WR-TIMEZONE:Asia/Karachi',
  ];

  for (const m of matches) {
    const home = m.home_team?.name || 'Home Team';
    const away = m.away_team?.name || 'Away Team';
    const sport = m.sport?.name || 'Match';
    const venue = m.venue?.name || 'Iqra University Islamabad';
    const summary = `${sport}: ${home} vs ${away}`;
    const description = `Match #${m.match_no || ''} (${m.round || 'Fixture'})\\nTournament: ${m.tournament?.name || 'Iqra University Sports'}\\nStatus: ${m.status.toUpperCase()}`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${m.id}@sports.iqra.edu.pk`,
      `DTSTAMP:${formatDateToICS(new Date().toISOString())}`,
      `DTSTART:${formatDateToICS(m.starts_at)}`,
      `DTEND:${formatDateToICS(m.ends_at)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${venue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
