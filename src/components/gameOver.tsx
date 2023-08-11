import classnames from "classnames";
import styles from "./style.module.scss";
import { FC, useRef, useState, useEffect } from "react";

function useGameOver(resetGame: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState<boolean>(false);

  function animationEnd() {
    if (ref.current) {
      ref.current.addEventListener(
        "animationend",
        (e: any) => {
          console.log(e);
          const timer = setTimeout(() => {
            clearTimeout(timer);
            setDone(true);
          }, 1000);
        },
        false
      );
    }
  }

  function restart() {
    done && resetGame();
  }

  useEffect(animationEnd, []);

  return {
    text: done ? "Play Again" : "Game Over",
    ref,
    restart,
  };
}

const GameOver: FC<any> = ({ resetGame }) => {
  const { ref, text, restart } = useGameOver(resetGame);

  return (
    <div ref={ref} className={classnames(styles.gameover, "animate__animated", "animate__fadeInUp")} onClick={restart}>
      {text}
    </div>
  );
};

export default GameOver;
