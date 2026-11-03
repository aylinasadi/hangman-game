import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePageFocus from "../usePageFocus";
import sfx from "../sound";
import SoundToggle from "../SoundToggle";
import Keyboard from "../components/Keyboard";



export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const headingRef = usePageFocus("Hangman – Game");
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

    const [word, setWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    const wrongGuessesCount = guessedLetters.filter((letter) => !word.includes(letter)).length;
    const remainingLives = maxLives - wrongGuessesCount;
    const maxHints = word.length > 0 ? Math.floor(word.length / 2) : 0;
    const isLost = remainingLives <= 0;
    const isWon = word.length > 0 &&word.split("").every((letter) => guessedLetters.includes(letter));
    const ready = !loading && !error && word.length > 0;

    const dangerLevel = Math.min(wrongGuessesCount / maxLives, 1);

    const wordLabel = word.split("").map((l) => (guessedLetters.includes(l) ? l : "blank")).join(", ");
    const lastLetter = guessedLetters[guessedLetters.length - 1];
    const announcement = !lastLetter
        ? ""
        : word.includes(lastLetter)
            ? `${lastLetter} is in the word. Word: ${wordLabel}.`
            : `${lastLetter} is not in the word. ${remainingLives} ${remainingLives === 1 ? "life" : "lives"} left.`;

    useEffect(() => {
        let cancelled = false;

        const fetchWord = async () => {
            setLoading(true);
            setError(null);
            try {
                const pattern = "?".repeat(targetLength);
                const response = await fetch(`https://api.datamuse.com/words?sp=${pattern}&max=300`);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();
                const singleWords = data.filter((item) => /^[a-zA-Z]+$/.test(item.word));
                if (singleWords.length === 0) {
                    throw new Error("No suitable words were found.");
                }

                const randomIndex = Math.floor(Math.random() * singleWords.length);
                if (!cancelled) setWord(singleWords[randomIndex].word.toUpperCase());
            } catch (err) {
                console.error("Error fetching word:", err);
                if (!cancelled) setError("The word could not be loaded. Check your connection and try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchWord();
        return () => {
            cancelled = true;
        };
    }, [targetLength, attempt]);

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
        if (remainingLives !== 1 || isWon || isLost) return;
        sfx.play("heartbeat", { exclusive: true, loop: true });
        return () => {
            sfx.stop("heartbeat");
        };
    }, [remainingLives, isWon, isLost]);

    const handleGuess = useCallback((letter) => {
        if (!ready || guessedLetters.includes(letter)) return;
        sfx.play(word.includes(letter) ? "correct" : "wrong");
        setGuessedLetters((prevGuessed) => {
            if (prevGuessed.includes(letter)) return prevGuessed;
            return [...prevGuessed, letter];
        });
    }, [ready, guessedLetters, word]);

    useEffect(() => {
        if (!ready || isWon || isLost) return;
        const handleKeyPress = (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const key = event.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) handleGuess(key);
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [ready, isWon, isLost, handleGuess]);

    const handleHint = () => {
        if (hintsUsed >= maxHints) return;
        const unguessedLetters = word.split("").filter((letter) => !guessedLetters.includes(letter));
        if (unguessedLetters.length === 0) return;

        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        sfx.play("hint");
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
        <main className="game-page min-vh-100 d-flex flex-column p-4 p-md-5 text-center position-relative z-0">
            <div className="danger-overlay" style={{ opacity: dangerLevel }} aria-hidden="true" />
            {wrongGuessesCount > 0 && <div key={wrongGuessesCount} className="danger-pulse" aria-hidden="true" />}
            {remainingLives === 1 && <div className="danger-heartbeat" aria-hidden="true" />}
            <h1 ref={headingRef} tabIndex={-1} className="visually-hidden">Hangman</h1>
            <p className="visually-hidden" role="status">{announcement}</p>
            <div className="game-stats d-flex justify-content-between align-items-center mb-3 fs-4">
                <span className="game-stat">Hints Remaining: <strong>{maxHints - hintsUsed}</strong></span>
                <span className="game-stat">Difficulty: <strong>{difficulty}</strong></span>
                <span className="text-danger game-stat-lives">Lives Remaining: {remainingLives} / {maxLives}</span>
            </div>
            <div className="game-actions d-flex justify-content-between mb-3">
                <button
                className="btn btn-lg px-4 hint-button"
                onClick={handleHint}
                disabled={!ready || isWon || isLost || hintsUsed >= maxHints}
                >Hint
                </button>
                <SoundToggle />
                <button
                className="btn btn-lg text-uppercase px-4 quit-button"
                onClick={handleQuit}
                >Quit
                </button>
            </div>
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                <div key={wrongGuessesCount} className={`word-display mb-5 font-monospace ${wrongGuessesCount > 0 ? "shake" : ""}`}>
                    {loading ? (<p className="fs-3 text-muted">Loading word...</p>) : error ? (
                        <div role="alert" className="game-error">
                            <p className="mb-3">{error}</p>
                            <button
                            className="btn btn-lg me-2 start-button"
                            onClick={() => setAttempt((n) => n + 1)}
                            >Try again
                            </button>
                            <button
                            className="btn btn-lg quit-button"
                            onClick={() => navigate("/")}
                            >Home
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="visually-hidden">Word: {wordLabel}</span>
                            <span aria-hidden="true" className="word-letters">
                                {word.split("").map((letter, index) => (
                                    <span key={index} className="word-letter">
                                        {guessedLetters.includes(letter) ? letter : "_"}
                                    </span>
                                ))}
                            </span>
                        </>
                    )}
                </div>
                <Keyboard
                    word={word}
                    guessedLetters={guessedLetters}
                    disabled={!ready || isWon || isLost}
                    onGuess={handleGuess}
                />
            </div>
        </main>
    );
}