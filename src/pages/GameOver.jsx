import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



export default function GameOver() {
    const location = useLocation();
    const navigate = useNavigate();
    const { hasWon, secretWord, score } = location.state || {
        hasWon: false,
        secretWord: "Unknown",
        score: 0
    };
    const [definition, setDefinition] = useState(null);
    const [defLoading, setDefLoading] = useState(true);
    useEffect(() => {
        if (!secretWord || secretWord === "Unknown") {
            setDefLoading(false);
            return;
        }
        const fetchDefinition = async () => {
            try {
                setDefLoading(true);
                const response = await fetch(`https://api.datamuse.com/words?sp=${secretWord.toLowerCase()}&md=d&max=1`);
                const data = await response.json();
                if (data.length > 0 && data[0].defs && data[0].defs.length > 0) {
                    const cleanDef = data[0].defs[0].replace(/^[a-z]+\t/, "");
                    setDefinition(cleanDef);
                } else {
                    setDefinition(null);
                }
            } catch (error) {
                console.error("Error fetching definition:", error);
                setDefinition(null);
            } finally {
                setDefLoading(false);
            }
        };
        fetchDefinition();
    }, [secretWord]);

    return (
        <div className="container mt-5" style={{ maxWidth: "500px"}}>
            <div className="card shadow-sm p-4 text-center">
                <div className={`alert ${hasWon ? "alert-success" : "alert-danger"} my-3`}>
                    <h2 className="alert-heading">{hasWon ? "You Survived!" : "You Died."}</h2>
                    <p className="mb-0">
                        {defLoading ? "Loading definition..." : definition ? `Definition: ${definition}` : "Oops! No definition found. You had a very rare word:)"}
                    </p>
                </div>
                <p className="fs-5">
                    The secret word was: <span className="badge bg-secondary font-monospace fs-6">{secretWord}</span>
                </p>
                {hasWon && <p className="text-muted">Remaining lives: {score}</p>}
                <div className="d-flex justify-content-center gap-2 mt-4">
                    <button className="btn btn-primary" onClick={() => navigate("/")}>Home</button>
                </div>
            </div>
        </div>
    );
}