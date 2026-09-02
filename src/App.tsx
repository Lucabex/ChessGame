import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import "./App.css";

function App() {
  const [game] = useState(
    new Chess("5r1k/1p5p/8/p7/P1PP4/4K3/3Q2RP/1q6 b - - 1 1"),
  );
  const [fen, setFen] = useState(game.fen());
  const [status, setStatus] = useState("");

  // Checks the game state and sets the message to show
  function updateStatus() {
    if (game.isCheckmate()) {
      setStatus("Checkmate");
    } else if (game.isCheck()) {
      setStatus("Check");
    } else {
      setStatus("");
    }
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const from = sourceSquare as Square;
    const to = targetSquare as Square;
    const piece = game.get(from);

    // Check if this is a pawn promotion
    if (piece && piece.type === "p") {
      const row = parseInt(targetSquare[1]);
      const isPromotion =
        (piece.color === "w" && row === 8) ||
        (piece.color === "b" && row === 1);

      if (isPromotion) {
        // Accept the drop, let the library's promotion dialog handle the rest
        return true;
      }
    }

    // Normal move (not a promotion)
    try {
      const move = game.move({
        from,
        to,
      });

      if (move === null) return false;
      setFen(game.fen());
      updateStatus();
      return true;
    } catch {
      return false;
    }
  }

  // Tells the library whether this move is a promotion (yes/no only)
  function onPromotionCheck(
    sourceSquare: string,
    targetSquare: string,
    piece: string,
  ) {
    const isPromotion =
      (piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") ||
      (piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1");

    return isPromotion;
  }

  // Runs after the user picks a piece in the library's default promotion box
  function onPromotionPieceSelect(
    piece?: string,
    promoteFromSquare?: string,
    promoteToSquare?: string,
  ) {
    if (!piece || !promoteFromSquare || !promoteToSquare) return false;

    try {
      const move = game.move({
        from: promoteFromSquare as Square,
        to: promoteToSquare as Square,
        promotion: piece[1].toLowerCase() as "q" | "r" | "b" | "n",
      });

      if (move === null) return false;
      setFen(game.fen());
      updateStatus();
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="chessBox">
      <div className="board">
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          onPromotionCheck={onPromotionCheck}
          onPromotionPieceSelect={onPromotionPieceSelect}
          boardWidth={600}
        />
        {status && <p className="text">{status}</p>}
      </div>
    </div>
  );
}

export default App;
