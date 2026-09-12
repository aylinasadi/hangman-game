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
        <div className="container mt-5" style={{ maxWidth: "500px"}}>
            <div className="card shaow-sm p-4 text-center">
                <div className={`alert ${hasWon ? "alert-success" : "alert-danger"} my-3`}>
                    <h2 className="alert-heading">{hasWon ? "You Survived!" : "You Died."}</h2>
                    <p className="mb-0"></p> {/* add word definition */}
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