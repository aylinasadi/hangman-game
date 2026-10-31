import { useState } from "react";
import sfx from "./sound";

export default function SoundToggle() {
    const [muted, setMuted] = useState(sfx.isMuted());

    const toggle = () => {
        const next = !muted;
        sfx.setMuted(next);
        setMuted(next);
    };

    return (
        <button
            type="button"
            aria-pressed={!muted}
            aria-label="Sound effects"
            onClick={toggle}
            className={`btn btn-lg px-4 difficulty-button ${!muted ? "is-selected" : ""}`}
        >
            Sound <span aria-hidden="true">{muted ? "Off" : "On"}</span>
        </button>
    );
}