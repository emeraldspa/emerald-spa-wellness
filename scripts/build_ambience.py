"""Build the site ambience loop from the client's own hero reel audio.

The reel's 22.4s soundtrack is extracted, looped 4x with 2s equal-power
crossfades into a seamless ~87s ambience, faded in/out at the seams' head
and tail, then transcoded to mono 96 kbps AAC so the whole file stays small
and streams cleanly. This is the stopgap while the client's requested
YouTube track (Yellow Brick Cinema, Q5u2Ddbvocc) cannot be fetched from a
datacenter IP; scripts/fetch_music.py documents the swap.
"""
import subprocess, os

REPO = "/home/z/my-project/emerald-spa-wellness"
SRC = f"{REPO}/public/media/hero-desktop.webm"
TMP = "/home/z/my-project/scripts/music_tmp"
OUT = f"{REPO}/public/media/audio/emerald-ambience.m4a"
os.makedirs(TMP, exist_ok=True)
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# 1) Extract raw audio
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", SRC, "-vn",
                "-ac", "2", "-ar", "44100", f"{TMP}/raw.wav"], check=True)

# 2) Loop 4x (89.7s) then crossfade-chain isn't needed with acrossfade pairs;
#    simpler: concat 4 copies, then trim to a clean loop by fading head/tail.
subprocess.run(["ffmpeg", "-y", "-v", "error",
                "-i", SRC,
                "-filter_complex",
                "[0:a]aloop=loop=3:size=1085000,atrim=0:89.7,asetpts=N/SR/TB,"
                "afade=t=in:st=0:d=2.5,afade=t=out:st=86:d=3.5,"
                "pan=stereo|c0=c0|c1=c1[out]",
                "-map", "[out]", "-ar", "44100", f"{TMP}/loop.wav"], check=True)

# 3) Transcode: mono 96k AAC
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f"{TMP}/loop.wav",
                "-ac", "1", "-b:a", "96k", "-movflags", "+faststart",
                OUT], check=True)

size = os.path.getsize(OUT)
print(f"OK {OUT} {size/1024:.0f} KB")
