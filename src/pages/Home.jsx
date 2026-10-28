import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Home() {
    const [difficulty, setDifficulty] = useState("Easy");
    const navigate = useNavigate();
    const startGame = () => {
        navigate("/game", { state: { chosenDifficulty: difficulty } });
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="card shadow p-5 text-center w-100" style={{ maxWidth: "800px" }}>
                <h1 className="title display-3 mb-5">Hangman Game</h1>
                <p className="fs-3 mb-4">Default Difficulty: {difficulty}</p>
                <div className="d-flex justify-content-center gap-3 mb-5">
                    <button className="btn btn-outline-primary btn-lg px-4" onClick={() => setDifficulty("Easy")}>Easy</button>
                    <button className="btn btn-outline-primary btn-lg px-4" onClick={() => setDifficulty("Medium")}>Medium</button>
                    <button className="btn btn-outline-primary btn-lg px-4" onClick={() => setDifficulty("Hard")}>Hard</button>
                </div>
                <button className="btn btn-success btn-lg fs-3 w-100 py-3" onClick={startGame}>Start Game</button>
            </div>
        </div>
    );
}
