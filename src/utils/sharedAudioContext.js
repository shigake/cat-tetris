let _ctx = null;
let _resumeListenerAdded = false;
let _activeOscillators = 0;
const MAX_OSCILLATORS = 20;

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

/** Returns false if oscillator limit is reached */
export function canPlaySound() {
 return _activeOscillators < MAX_OSCILLATORS;
}

export function trackOscillatorStart() {
 _activeOscillators++;
}

export function trackOscillatorEnd() {
 _activeOscillators = Math.max(0, _activeOscillators - 1);
}
