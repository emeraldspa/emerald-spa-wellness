/**
 * Single sound channel for the whole site: one looping ambience track.
 *
 * SiteAudio (mounted once in the root layout) owns the <audio> element; the
 * floating sound button in FloatingActions renders the only control. They
 * talk through these window events so neither needs to know where the other
 * is mounted, and the control can never lie about what is audible.
 *
 * The hero reel is a silent visual now: this track is the site's one sound,
 * so there is never two audios playing at once.
 *
 * Event contract:
 * - emerald:music-state  { playing } - the audio element's truth, on every change
 * - emerald:music-toggle request from the button - SiteAudio acts on it
 */
export const MUSIC_STATE = 'emerald:music-state';
export const MUSIC_TOGGLE = 'emerald:music-toggle';
export const MUSIC_PREF_KEY = 'emerald-music';

export type MusicStateDetail = { playing: boolean };
