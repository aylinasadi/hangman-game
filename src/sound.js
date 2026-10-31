const FILES = {
    correct: `${import.meta.env.BASE_URL}sounds/correct.wav`,
    wrong: `${import.meta.env.BASE_URL}sounds/wrong.wav`,
    hint: `${import.meta.env.BASE_URL}sounds/hint.wav`,
    heartbeat: `${import.meta.env.BASE_URL}sounds/heartbeat.wav`,
    win: `${import.meta.env.BASE_URL}sounds/win.mp3`,
    lose: `${import.meta.env.BASE_URL}sounds/lose.wav`,
};

let muted = false;
const activeAudio = new Map();
try {
    muted = localStorage.getItem("hangman-muted") === "1";
} catch {

}

function stop(name) {
    const audio = activeAudio.get(name);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    activeAudio.delete(name);
}

function stopAll() {
    for (const name of activeAudio.keys()) {
        stop(name);
    }
}

function play(name, { exclusive = false, loop = false } = {}) {
    if (muted) return;
    if (exclusive) stop(name);
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
    if (value) stopAll();
    try {
        localStorage.setItem("hangman-muted", value ? "1" : "0");
    } catch {

    }
    if (!value) play("correct");
}

const sfx = { play, stop, stopAll, isMuted, setMuted };
export default sfx;