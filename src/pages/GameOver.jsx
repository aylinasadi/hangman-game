import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import usePageFocus from "../usePageFocus";
import sfx from "../sound";



export default function GameOver() {
    const location = useLocation();
    const navigate = useNavigate();
    const { hasWon, secretWord, score, hintsUsed } = location.state || {
        hasWon: false,
        secretWord: "Unknown",
        score: 0,
        hintsUsed: 0,
    };
    const headingRef = usePageFocus(hasWon ? "Hangman – You survived" : "Hangman – You died");

    useEffect(() => {
        if (!location.state) return;
        sfx.stop("heartbeat");
        const resultSound = hasWon ? "win" : "lose";
        sfx.play(resultSound, { exclusive: true });
        return () => sfx.stop(resultSound);
    }, [location.state, hasWon]);

    const [definition, setDefinition] = useState(null);
    const [defLoading, setDefLoading] = useState(true);
    useEffect(() => {
        if (!secretWord || secretWord === "Unknown") {
            setDefLoading(false);
            return;
        }
        const fetchDefinition = async () => {
            try {
                setDefLoading(true);
                const response = await fetch(`https://api.datamuse.com/words?sp=${secretWord.toLowerCase()}&md=d&max=1`);
                const data = await response.json();
                if (data.length > 0 && data[0].defs && data[0].defs.length > 0) {
                    const cleanDef = data[0].defs[0].replace(/^[a-z]+\t/, "");
                    setDefinition(cleanDef);
                } else {
                    setDefinition(null);
                }
            } catch (error) {
                console.error("Error fetching definition:", error);
                setDefinition(null);
            } finally {
                setDefLoading(false);
            }
        };
        fetchDefinition();
    }, [secretWord]);

    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="card shadow p-5 text-center w-100" style={{ maxWidth: "800px" }}>
                <div className={`alert result-alert ${hasWon ? "is-win" : "is-loss"} my-3 py-4`}>
                    <h1 ref={headingRef} tabIndex={-1} className="display-3 fw-bold alert-heading mb-0">{hasWon ? "You Survived!" : "You Died."}</h1>
                </div>
                <p className="display-6 mt-4">
                    The secret word was: <span className="badge secret-word font-monospace">{secretWord}</span>
                </p>
                <p className="fs-4 mb-0" aria-live="polite">
                    {defLoading ? "Loading definition..." : definition ? `Definition: ${definition}` : "Oops! No definition found. You had a very rare word:)"}
                </p>
                {hasWon && <p className="text-muted fs-4 my-4">Remaining Lives: {score}</p>}
                <p className="text-muted fs-4 mt-4">Hints Used: {hintsUsed}</p>
                <div className="d-flex justify-content-center gap-2 mt-4">
                    <button className="btn btn-lg fs-3 px-5 py-3 home-button" onClick={() => navigate("/")}>Home</button>
                </div>
            </div>
        </main>
    );
}