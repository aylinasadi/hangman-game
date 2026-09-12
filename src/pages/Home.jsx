import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Home() {
    const [difficulty, setDifficulty] = useState("Easy");
    const navigate = useNavigate();
    const startGame = () => {
        navigate("/game", { state: { chosenDifficulty: difficulty } });
    };

    return (
        <div className="container text-center mt-5">
            <h1>Hangman Game</h1>
            <p>Selected Difficulty: {difficulty}</p>
            <button className="btn btn-outline-primary mx-1" onClick={() => setDifficulty("Easy")}>Easy</button>
            <button className="btn btn-outline-primary mx-1" onClick={() => setDifficulty("Medium")}>Medium</button>
            <button className="btn btn-outline-primary mx-1" onClick={() => setDifficulty("Hard")}>Hard</button>
            <button className="btn btn-success mx-1" onClick={startGame}>Start Game</button>
        </div>
    );
}
