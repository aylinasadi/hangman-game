const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Keyboard({ word, guessedLetters, disabled, onGuess }) {
    return (
        <div role="group" aria-label="Letters" className="game-keyboard d-flex flex-wrap justify-content-center gap-3" style={{ maxWidth: "1000px" }}>
            {ALPHABET.map((letter) => {
                const guessed = guessedLetters.includes(letter);
                const status = !guessed ? "" : word.includes(letter) ? "correct" : "wrong";
                return (
                    <button
                        key={letter}
                        type="button"
                        onClick={() => onGuess(letter)}
                        disabled={disabled || guessed}
                        aria-label={status ? `${letter}, ${status}` : letter}
                        className={`btn fs-4 keyboard-key ${status ? `is-${status}` : ""}`}
                    >
                        {letter}
                    </button>
                );
            })}
        </div>
    );
}