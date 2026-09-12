import { useLocation, useNavigate } from "react-router-dom";



export default function GameOver() {
    const location = useLocation();
    const navigate = useNavigate();
    const { hasWon, secretWord, score } = location.state || {
        hasWon: false,
        secretWord: "Unknown",
        score: 0
    };

    return (
        <div>
            <h1>Game Over Screen</h1>
            <p>{hasWon ? "You Survived!" : "You Are Dead."}</p>
            <p>The secret word was: {secretWord}</p>
            <p>Your score: {score}</p>
            <button onClick={() => navigate("/")}>Home</button>
        </div>
    );
}