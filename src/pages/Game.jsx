import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const difficulty = location.state?.chosenDifficulty || "Easy";
    
    const livesByDifficulty = {
        Easy: 8,
        Medium: 6,
        Hard: 4
    };

    const wordLength = {
            Easy: 5,
            Medium: 7,
            Hard: 10,
    };

    const maxLives = livesByDifficulty[difficulty] || 6;
    const targetLength = wordLength[difficulty] || 5;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const [word, setWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hintsUsed, setHintsUsed] = useState(0);

    const wrongGuessesCount = guessedLetters.filter((letter) => !word.includes(letter)).length;
    const remainingLives = maxLives - wrongGuessesCount;
    const maxHints = word.length > 0 ? Math.floor(word.length / 2) : 0;
    const isLost = remainingLives <= 0;
    const isWon = word.length > 0 &&word.split("").every((letter) => guessedLetters.includes(letter));

    useEffect(() => {
        const fetchWord = async () => {
            try {
                setLoading(true);
                const pattern = "?".repeat(targetLength);
                const response = await fetch(`https://api.datamuse.com/words?sp=${pattern}&max=100`);
                const data = await response.json();
                const singleWords = data.filter((item) => /^[a-zA-Z]+$/.test(item.word));
                const randomIndex = Math.floor(Math.random() * singleWords.length);
                setWord(singleWords[randomIndex].word.toUpperCase());
            } catch (error) {
                console.error("Error fetching word:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWord();
    }, [targetLength]);

    useEffect(() => {
        if (isWon || isLost) {
            navigate("/game-over", {
                state: {
                    hasWon:isWon,
                    secretWord:word,
                    score: remainingLives,
                    hintsUsed: hintsUsed,
                },
            });
        }
    }, [isWon, isLost, navigate, word, remainingLives, hintsUsed]);

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
    }, [loading, isWon, isLost, alphabet, guessedLetters]);

    const handleGuess = (letter) => {
        setGuessedLetters((prevGuessed) => {
        if (prevGuessed.includes(letter)) return prevGuessed;
        return [...prevGuessed, letter];
        });
    };

    
    const handleHint = () => {
        if (hintsUsed >= maxHints) return;
        const unguessedLetters = word.split("").filter((letter) => !guessedLetters.includes(letter));
        if (unguessedLetters.length === 0) return;

        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        setGuessedLetters((prev) => [...prev, randomLetter]);
        setHintsUsed((prev) => prev + 1);
    };

    const handleQuit = () => {
        const confirmQuit = window.confirm("Are you sure you want to quit this game?");
        if (confirmQuit) {
            navigate("/");
        }
    };

    

    return (
            <div className="p-4 text-center">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Difficulty: {difficulty}</span>
                    <span>Hints Remaining: {maxHints - hintsUsed}</span>
                    <span className="text-danger">Lives Remaining: {remainingLives} / {maxLives}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-sm btn-outline-primary" onClick={handleHint} disabled={loading || isWon || isLost || hintsUsed >= maxHints}>Hint</button>
                    <button className="btn btn-outline-danger btn-sm text-uppercase" onClick={handleQuit}>Quit</button>
                </div>
                <div className="mb-4 fs-1 font-monospace" style={{ letterSpacing: "0.5rem" }}>
                    {loading ? (<p className="fs-5 text-muted">Loading word...</p>) :
                    (word.split("").map((letter, index) => (
                    <span key={index} className="mx-1">
                        {guessedLetters.includes(letter) ? letter : "_"}
                    </span>
                    )))}
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                    {alphabet.map((letter) => (
                        <button
                            key={letter}
                            onClick={() => handleGuess(letter)}
                            disabled={guessedLetters.includes(letter) || isWon || isLost}
                            className="btn btn-outline-primary"
                            style={{ width: "40px", height: "40px", padding: "0" }}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
    );
}