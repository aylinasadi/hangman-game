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
        <button type="button" onClick={toggle} className={`btn btn-lg px-4 difficulty-button ${!muted ? "is-selected" : ""}`}>
            Sound: {muted ? "Off" : "On"}
        </button>
    );
}