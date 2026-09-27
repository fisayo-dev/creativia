"use client";

/**
 * tiny synthesized sound effects via the web audio api.
 * no audio files to load, and they work offline.
 */

export type SoundName = "correct" | "wrong" | "skip" | "tap" | "finish" | "reveal" | "open" | "close";

type Note = { freq: number; at: number; duration: number; type?: OscillatorType; gain?: number };

const SOUNDS: Record<SoundName, Note[]> = {
  // bright rising two-note chime
  correct: [
    { freq: 659.25, at: 0, duration: 0.12, type: "triangle" },
    { freq: 987.77, at: 0.09, duration: 0.24, type: "triangle" },
  ],
  // soft descending buzz
  wrong: [
    { freq: 220, at: 0, duration: 0.16, type: "sawtooth", gain: 0.08 },
    { freq: 164.81, at: 0.12, duration: 0.26, type: "sawtooth", gain: 0.08 },
  ],
  skip: [{ freq: 392, at: 0, duration: 0.12, type: "sine", gain: 0.12 }],
  tap: [{ freq: 880, at: 0, duration: 0.05, type: "sine", gain: 0.06 }],
  // quick sparkle when a hint letter flips over
  reveal: [
    { freq: 1318.51, at: 0, duration: 0.08, type: "sine", gain: 0.08 },
    { freq: 1760, at: 0.06, duration: 0.14, type: "sine", gain: 0.07 },
  ],
  // soft rising swoosh as a dialog pops open
  open: [
    { freq: 392, at: 0, duration: 0.09, type: "triangle", gain: 0.1 },
    { freq: 587.33, at: 0.06, duration: 0.09, type: "triangle", gain: 0.1 },
    { freq: 783.99, at: 0.12, duration: 0.18, type: "triangle", gain: 0.1 },
  ],
  // the same shape falling back down as it closes
  close: [
    { freq: 698.46, at: 0, duration: 0.08, type: "triangle", gain: 0.08 },
    { freq: 440, at: 0.06, duration: 0.14, type: "triangle", gain: 0.08 },
  ],
  // little victory arpeggio
  finish: [
    { freq: 523.25, at: 0, duration: 0.14, type: "triangle" },
    { freq: 659.25, at: 0.12, duration: 0.14, type: "triangle" },
    { freq: 783.99, at: 0.24, duration: 0.14, type: "triangle" },
    { freq: 1046.5, at: 0.36, duration: 0.4, type: "triangle" },
  ],
};

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // browsers suspend audio until a user gesture; every play() follows one
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playSound(name: SoundName) {
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;

  for (const note of SOUNDS[name]) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const start = now + note.at;
    const peak = note.gain ?? 0.18;

    osc.type = note.type ?? "sine";
    osc.frequency.setValueAtTime(note.freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);

    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + note.duration + 0.02);
  }
}
