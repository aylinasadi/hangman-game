import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePageFocus from "../usePageFocus";
import sfx from "../sound";
import SoundToggle from "../SoundToggle";



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

    const dangerLevel = Math.min(wrongGuessesCount / maxLives, 1);

    const wordLabel = word.split("").map((l) => (guessedLetters.includes(l) ? l : "blank")).join(", ");
    const lastLetter = guessedLetters[guessedLetters.length - 1];
    const announcement = !lastLetter
        ? ""
        : word.includes(lastLetter)
            ? `${lastLetter} is in the word. Word: ${wordLabel}.`
            : `${lastLetter} is not in the word. ${remainingLives} ${remainingLives === 1 ? "life" : "lives"} left.`;

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
        if (remainingLives !== 1 || isWon || isLost) return;
        sfx.play("heartbeat", { exclusive: true, loop: true });
        return () => {
            sfx.stop("heartbeat");
        };
    }, [remainingLives, isWon, isLost]);

    useEffect(() => {
        if (loading || isWon || isLost) return;
        const handleKeyPress = (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
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
        if (guessedLetters.includes(letter)) return;
        sfx.play(word.includes(letter) ? "correct" : "wrong");
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
        <main className="min-vh-100 d-flex flex-column p-4 p-md-5 text-center position-relative z-0">
            <div className="danger-overlay" style={{ opacity: dangerLevel }} aria-hidden="true" />
            {wrongGuessesCount > 0 && <div key={wrongGuessesCount} className="danger-pulse" aria-hidden="true" />}
            {remainingLives === 1 && <div className="danger-heartbeat" aria-hidden="true" />}
            <h1 ref={headingRef} tabIndex={-1} className="visually-hidden">Hangman</h1>
            <p className="visually-hidden" role="status">{announcement}</p>
            <div className="d-flex justify-content-between align-items-center mb-3 fs-4">
                <span className="game-stat">Difficulty: <strong>{difficulty}</strong></span>
                <span className="game-stat">Hints Remaining: <strong>{maxHints - hintsUsed}</strong></span>
                <span className="text-danger">Lives Remaining: {remainingLives} / {maxLives}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-lg px-4 hint-button" onClick={handleHint} disabled={loading || isWon || isLost || hintsUsed >= maxHints}>Hint</button>
                <SoundToggle />
                <button className="btn btn-lg text-uppercase px-4 quit-button" onClick={handleQuit}>Quit</button>
            </div>
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                <div key={wrongGuessesCount} className={`word-display mb-5 font-monospace ${wrongGuessesCount > 0 ? "shake" : ""}`} style={{ fontSize: "5rem", letterSpacing: "1rem" }}>
                    {loading ? (<p className="fs-3 text-muted">Loading word...</p>) : (
                        <>
                            <span className="visually-hidden">Word: {wordLabel}</span>
                            <span aria-hidden="true">
                                {word.split("").map((letter, index) => (
                                    <span key={index} className="mx-1">
                                        {guessedLetters.includes(letter) ? letter : "_"}
                                    </span>
                                ))}
                            </span>
                        </>
                    )}
                </div>
                <div role="group" aria-label="Letters" className="d-flex flex-wrap justify-content-center gap-3" style={{ maxWidth: "1000px" }}>
                    {alphabet.map((letter) => {
                        const status = !guessedLetters.includes(letter) ? "" : word.includes(letter) ? "correct" : "wrong";
                        return (
                            <button
                                key={letter}
                                type="button"
                                onClick={() => handleGuess(letter)}
                                disabled={guessedLetters.includes(letter) || isWon || isLost}
                                aria-label={status ? `${letter}, ${status}` : letter}
                                className={`btn fs-4 keyboard-key ${status ? `is-${status}` : ""}`}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}