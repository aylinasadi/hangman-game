import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Home() {
    const [difficulty, setDifficulty] = useState("easy");
    const navigate = useNavigate();
    const startGame = () => {
        navigate("/game", { state: { chosenDifficulty: difficulty } });
    };

    return (
        <div>
            <h1>Hangman Game</h1>
            <p>Selected Difficulty: {difficulty}</p>
            <button onClick={() => setDifficulty("easy")}>Easy</button>
            <button onClick={() => setDifficulty("medium")}>Medium</button>
            <button onClick={() => setDifficulty("hard")}>Hard</button>
            <button onClick={startGame}>Start Game</button>
        </div>
    );
}
