/**
 * Shared AudioContext singleton — avoids browser limits and
 * "AudioContext was not allowed to start" errors.
 *
 * Auto-resumes on first user gesture (click / touch / keydown).
 */

let _ctx = null;
let _resumeListenerAdded = false;

function _resumeOnGesture() {
  if (_ctx && _ctx.state === 'suspended') {
    _ctx.resume().catch(() => {});
  }
}

function _addResumeListener() {
  if (_resumeListenerAdded) return;
  _resumeListenerAdded = true;
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, _resumeOnGesture, { once: false, passive: true });
  });
}

/**
 * Returns a single shared AudioContext (created lazily).
 * Safe to call many times — always returns the same instance.
 * Returns null if Web Audio is unavailable.
 */
export function getAudioContext() {
  if (_ctx) {
    if (_ctx.state === 'suspended') {
      _ctx.resume().catch(() => {});
    }
    return _ctx;
  }

  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
    _addResumeListener();
    return _ctx;
  } catch {
    return null;
  }
}
