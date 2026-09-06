/**
 * Single sound channel for the site: the hero reel's own soundtrack.
 *
 * HeroVideo owns the <video> and its muted state; the floating SoundWidget
 * in FloatingActions renders the mute control. They talk through these
 * window events so neither needs to know where the other is mounted.
 *
 * Event contract:
 * - emerald:hero-video-ready  the reel attached and started playing
 * - emerald:hero-video-gone   the reel unmounted (route change) - widget hides
 * - emerald:hero-sound        { muted, hasAudio } - state change, widget syncs
 * - emerald:hero-sound-toggle request from the widget - HeroVideo acts on it
 */
export const HERO_VIDEO_READY = 'emerald:hero-video-ready';
export const HERO_VIDEO_GONE = 'emerald:hero-video-gone';
export const HERO_SOUND_STATE = 'emerald:hero-sound';
export const HERO_SOUND_TOGGLE = 'emerald:hero-sound-toggle';
export const SOUND_PREF_KEY = 'emerald-sound';

export type HeroSoundDetail = { muted: boolean; hasAudio: boolean };
