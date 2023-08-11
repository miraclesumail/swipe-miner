import { createContext, useMemo, useReducer, useRef } from "react";
import Nav from "./nav";
import useGenerate from "../hooks/useGenerate";
import useCount from "../hooks/useCount";
import GameOver from "./gameOver";
import Grid from "./grid";
import styles from "./style.module.scss";

/**
 * 10 * 8 small
 * 18* 14 medium
 * @returns
 */

type ContextProps = {
  flagArrs: any[];
  clickArrs: any[];
  bombsAxisArrs: number[];
  judgeGridType: (params: any) => any;
  isFliping: boolean;
  dispatch: any;
  level: string;
};

export const Context = createContext<ContextProps>({ flagArrs: [], clickArrs: [] } as any);

const initialState: any = {
  flagArrs: [],
  clickArrs: [],
  isFliping: false,
  isOver: false,
  showMode: false,
  level: "easy",
};

function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "toggleClickArrs": {
      return { ...state, clickArrs: Array.from(new Set([...state.clickArrs, ...action.payload])) };
    }
    case "toggleFlagArrs": {
      if (state.flagArrs.includes(action.payload)) {
        return { ...state, flagArrs: [...state.flagArrs.filter((item: number) => item !== action.payload)] };
      } else {
        return { ...state, flagArrs: [...state.flagArrs, action.payload] };
      }
    }
    case "setIsFliping": {
      return { ...state, isFliping: true };
    }
    case "setIsOver": {
      return { ...state, isOver: action.payload };
    }
    case "setShowMode": {
      return { ...state, showMode: action.payload };
    }
    case "setLevel": {
      return { ...state, level: action.payload };
    }
    case "reset": {
      return {
        ...initialState,
        level: state.level,
      };
    }
    default:
      throw new Error();
  }
}

const Container = () => {
  const timer = useRef<any>(null);

  const [{ flagArrs, clickArrs, isFliping, isOver, level, showMode }, dispatch]: any = useReducer(reducer, initialState);

  const { count, startCount, reset: resetCount, stop } = useCount();
  const { bombsAxisArrs, x, y, judgeGridType, reset } = useGenerate({ level });

  console.log(bombsAxisArrs, "bombsAxisArrsbombsAxisArrsbombsAxisArrs");

  const getStyles = () => ({
    width: `${x * 30}px`,
    height: `${y * 30}px`,
    gridTemplateColumns: `repeat(${x}, 1fr)`,
    gridTemplateRows: `repeat(${y}, 1fr)`,
  });

  // 翻开所有雷
  function toggleAllBomb(copyBombArrs: number[]) {
    clearTimeout(timer.current);
    if (!copyBombArrs.length) return dispatch({ type: "setIsOver", payload: true });

    const targetIndex = copyBombArrs.shift() as number;
    if (!clickArrs.includes(targetIndex)) {
      dispatch({ type: "toggleClickArrs", payload: [targetIndex] });
    }
    timer.current = setTimeout(() => toggleAllBomb(copyBombArrs), 100);
  }

  // when hit a bomb
  function clickBomb(index: number) {
    console.log("GridType.bombGridType.bomb");
    dispatch({ type: "setIsFliping" });
    dispatch({ type: "toggleClickArrs", payload: [index] });
    stop();
    const copyBombArrs = [...bombsAxisArrs].filter((item) => item !== index);
    timer.current = setTimeout(() => toggleAllBomb(copyBombArrs), 100);
  }

  function clearTimer() {
    clearTimeout(timer.current);
    timer.current = null;
  }

  // 重新开始游戏
  function resetGame() {
    reset();
    resetCount();
    dispatch({ type: "reset" });
  }

  function toggleShow() {
    dispatch({ type: "setShowMode", payload: !showMode });
  }

  // 是否通关
  const isSuccess = useMemo(() => {
    return flagArrs.length === bombsAxisArrs.length && flagArrs.length + clickArrs.length === x * y;
  }, [flagArrs, clickArrs, bombsAxisArrs]);

  return (
    <Context.Provider value={{ flagArrs, clickArrs, dispatch, bombsAxisArrs, judgeGridType, isFliping, level }}>
      <div>
        <Nav resetGame={resetGame} toggleShow={toggleShow} clearTimer={clearTimer} bombsAxisArrs={bombsAxisArrs} flagArrs={flagArrs} count={count} level={level} />
        <div className={styles.container} style={getStyles()}>
          {Array.from({ length: x * y }, (_, index) => index).map((_, index) => (
            <Grid key={index} index={index} y={Math.floor(index / x)} x={index % x} {...judgeGridType(index)} level={level} showMode={showMode} clickBomb={clickBomb} startCount={startCount} />
          ))}

          {isOver && <GameOver resetGame={resetGame} />}
          {isSuccess && <GameOver resetGame={resetGame} type={"success"} />}
        </div>
      </div>
    </Context.Provider>
  );
};

export default Container;
