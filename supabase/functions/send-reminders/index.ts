// Supabase Edge Function: send-reminders
// Triggered via cron (e.g., every 30 minutes) to send 24h & 1h match reminders

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const in1Hour = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

  // Find upcoming scheduled matches
  const { data: upcomingMatches, error } = await supabase
    .from('matches')
    .select('id, round, starts_at, home_team:home_team_id(name), away_team:away_team_id(name), venue:venue_id(name)')
    .eq('status', 'scheduled')
    .lte('starts_at', in24Hours)
    .gte('starts_at', now.toISOString());

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Create notifications for team members
  const notificationsCreated = [];
  for (const match of upcomingMatches || []) {
    const { data: users } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['player', 'coach', 'spectator']);

    for (const u of users || []) {
      const { data: notif } = await supabase.from('notifications').insert({
        user_id: u.id,
        type: 'reminder',
        title: `Upcoming Match: ${match.home_team?.name} vs ${match.away_team?.name}`,
        body: `Match starts soon at ${match.venue?.name}. Be on time!`,
        link: `/live`,
      }).select().single();

      if (notif) notificationsCreated.push(notif.id);
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      reminders_sent: notificationsCreated.length,
      matches_processed: (upcomingMatches || []).length,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
