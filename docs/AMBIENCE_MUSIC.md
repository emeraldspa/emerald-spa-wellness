# Site ambience - the one soundtrack

The site plays a single looping track on every route, on by default: it
fades in on the visitor's first tap, click or key press (browser autoplay
rules make that the honest version of "on"), it pauses and resumes from the
floating sound control on the side of the screen, and the choice persists
between visits. The player is `src/components/SiteAudio.tsx`; the file is
`public/media/audio/ambience.m4a`, fetched only when playback actually
starts (preload="none"), so it never touches the page budget. The hero reel
is muted by design so there is exactly one audible source.

## Track status (9 Sep 2026)

Mr Oj chose "Spa Music Relaxation" by Yellow Brick Cinema
(https://www.youtube.com/watch?v=Q5u2Ddbvocc) and asked for it to be
downloaded from YouTube. Datacentre networks are blocked by YouTube's bot
checks (yt-dlp, Invidious, Piped and cobalt mirrors all refused), so the
shipped file is a stopgap loop built from the audio of the spa's own venue
film (`scripts/build_ambience.py` - the spa owns that audio outright).

## Swapping in the requested track (no code changes)

1. On a residential connection, download the audio once, e.g.
   `yt-dlp -f "bestaudio[ext=m4a]" --no-playlist -o ambience.m4a https://www.youtube.com/watch?v=Q5u2Ddbvocc`
2. Normalise it: mono, 96 kbps AAC, gentle loudness, 1-3 minutes is plenty
   because it loops:
   `ffmpeg -i ambience.m4a -ac 1 -b:a 96k -movflags +faststart ambience.m4a`
3. Replace `public/media/audio/ambience.m4a` in the repo, commit as Emerald
   Webmaster, push to main. Vercel deploys; no code changes are needed. If
   the 3-hour source is preferred, cut a 2-5 minute section first
   (`ffmpeg -ss 01:23:00 -t 180 ...`) and fade the head and tail.
