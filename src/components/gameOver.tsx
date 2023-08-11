import classnames from "classnames";
import styles from "./style.module.scss";
import { FC, useRef, useState, useEffect, useMemo } from "react";

function useGameOver(resetGame: () => void, type: string) {
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

  const text = useMemo(() => {
    if (done) {
      return "Play Again";
    } else {
      if (type === "success") {
        return "Success Game";
      } else {
        return "Game Over";
      }
    }
  }, [done, type]);

  useEffect(animationEnd, []);

  return {
    text,
    ref,
    restart,
  };
}

const GameOver: FC<any> = ({ resetGame, type = "fail" }) => {
  const { ref, text, restart } = useGameOver(resetGame, type);

  return (
    <div ref={ref} className={classnames(styles.gameover, "animate__animated", "animate__fadeInUp")} onClick={restart}>
      {text}
    </div>
  );
};

export default GameOver;
