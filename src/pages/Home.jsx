import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Home() {
    const [difficulty, setDifficulty] = useState("Easy");
    const navigate = useNavigate();
    const startGame = () => {
        navigate("/game", { state: { chosenDifficulty: difficulty } });
    };

    return (
        <div className="container mt-5 my-5" style={{ maxWidth: "500px"}}>
            <div className="card shadow p-4 text-center">
            <div className="container text-center">
                <h1 className="mb-5">Hangman Game</h1>
                <p>Default Difficulty: {difficulty}</p>
                <button className="btn btn-outline-primary mx-1" onClick={() => setDifficulty("Easy")}>Easy</button>
                <button className="btn btn-outline-primary mx-1" onClick={() => setDifficulty("Medium")}>Medium</button>
                <button className="btn btn-outline-primary mx-1" onClick={() => setDifficulty("Hard")}>Hard</button>
            </div>
            <button className="btn btn-success mx-5 my-3" onClick={startGame}>Start Game</button>
            </div>
        </div>
    );
}
