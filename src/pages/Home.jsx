import { useNavigate } from "react-router-dom";
import { useState } from "react";
import usePageFocus from "../usePageFocus";
import SoundToggle from "../SoundToggle";


export default function Home() {
    const [difficulty, setDifficulty] = useState("Easy");
    const navigate = useNavigate();
    const headingRef = usePageFocus("Hangman");
    const startGame = () => {
        navigate("/game", { state: { chosenDifficulty: difficulty } });
    };

    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="card shadow p-5 text-center w-100" style={{ maxWidth: "800px" }}>
                <h1 ref={headingRef} tabIndex={-1} className="title display-3 mb-5">Hangman Game</h1>
                <p className="theme-copy fs-3 mb-4">Default Difficulty: {difficulty}</p>
                <div role="group" aria-label="Difficulty" className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                    {["Easy", "Medium", "Hard"].map((level) => (
                        <button
                            key={level}
                            type="button"
                            aria-pressed={difficulty === level}
                            className={`btn btn-lg px-4 difficulty-button ${difficulty === level ? "is-selected" : ""}`}
                            onClick={() => setDifficulty(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <button className="btn btn-lg fs-3 w-100 py-3 start-button" onClick={startGame}>Start Game</button>
                <div className="mt-4">
                    <SoundToggle />
                </div>
            </div>
        </main>
    );
}
