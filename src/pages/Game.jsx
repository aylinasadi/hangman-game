import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



export default function Game() {
    const location = useLocation();
    const difficulty = location.state?.chosenDifficulty || "easy";
    useEffect(() => {
        const wordLength = {
            easy: 5,
            medium: 7,
            hard: 10,
        };
        const targetLength = wordLength[difficulty] || 5;
        const fetchWord = async () => {
            try {
                const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${targetLength}`);
                const data = await response.json();
                setWord(data[0].toUpperCase());
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching word:", error);
            }
        };
        fetchWord();
    }, []);
    const [word, setWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleGuess = (letter) => {
        setGuessedLetters((prevGuessed) => {
        if (prevGuessed.includes(letter)) return prevGuessed;
        return [...prevGuessed, letter];
        });
    };
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const mistakeCount = guessedLetters.filter((letter) => !word.includes(letter)).length;
    const maxMistakes = 6;
    const isLost = mistakeCount >= maxMistakes;
    const isWon = word.length > 0 &&word.split("").every((letter) => guessedLetters.includes(letter));
    const navigate = useNavigate();
    useEffect(() => {
        if (isWon || isLost) {
            navigate("/game-over", {
                state: { hasWon:isWon, secretWord:word, score: maxMistakes - mistakeCount, }
            });
        }
    }, [isWon, isLost]);
    useEffect(() => {
        if (loading || isWon || isLost) return;
        const handleKeyPress = (event) => {
            const key = event.key.toUpperCase();
            if (alphabet.includes(key)) {
                handleGuess(key);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [loading, isWon, isLost, word]);

    

    return (
        <div>
            <h1>Game Screen</h1>
            <p>Lives remaining: {maxMistakes - mistakeCount} / {maxMistakes}</p>
            <p>Difficulty: {difficulty}</p>
            {loading ? <p>Loading word...</p> : <p>{word.split("").map((letter) => (guessedLetters.includes(letter) ? letter : "_ "))}</p>}
            {alphabet.map((letter) => (
                <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter)}
                >
                {letter}
                </button>
            ))}
        </div>
    );
}