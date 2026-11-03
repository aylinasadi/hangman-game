const FILES = {
    correct: `${import.meta.env.BASE_URL}sounds/correct.wav`,
    wrong: `${import.meta.env.BASE_URL}sounds/wrong.wav`,
    hint: `${import.meta.env.BASE_URL}sounds/hint.wav`,
    heartbeat: `${import.meta.env.BASE_URL}sounds/heartbeat.wav`,
    win: `${import.meta.env.BASE_URL}sounds/win.mp3`,
    lose: `${import.meta.env.BASE_URL}sounds/lose.wav`,
};

let muted = false;
try {
    muted = localStorage.getItem("hangman-muted") === "1";
} catch {
    /* keep sound on */
}

const activeAudio = new Map(); // name -> the audio that is playing atm
const loops = new Set();       // looping sounds that should be playing even while muted

// pause a sound but keep it in loops so it can come back after unmuting
function halt(name) {
    const audio = activeAudio.get(name);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    activeAudio.delete(name);
}

// stop a sound compeltely and remove it from loops so it wont come back after unmuting
function stop(name) {
    loops.delete(name);
    halt(name);
}

function play(name, { exclusive = false, loop = false } = {}) {
    if (loop) loops.add(name);
    if (muted) return;
    if (exclusive) halt(name);
    const audio = new Audio(FILES[name]);
    audio.volume = 0.6;
    audio.loop = loop;
    activeAudio.set(name, audio);
    audio.addEventListener("ended", () => {
        if (activeAudio.get(name) === audio) activeAudio.delete(name);
    }, { once: true });
    audio.play().catch(() => {});
}

function isMuted() {
    return muted;
}

function setMuted(value) {
    muted = value;
    try {
        localStorage.setItem("hangman-muted", value ? "1" : "0");
    } catch {
        /* ignore */
    }
    if (value) {
        [...activeAudio.keys()].forEach(halt);
    } else {
        loops.forEach((name) => play(name, { exclusive: true, loop: true }));
        play("correct");
    }
}

const sfx = { play, stop, isMuted, setMuted };
export default sfx;