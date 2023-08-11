import { createContext, useReducer } from "react";
import useGenerate from "../hooks/useGenerate";
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
};

export const Context = createContext<ContextProps>({ flagArrs: [], clickArrs: [] } as any);

const initialState: any = {
  flagArrs: [],
  clickArrs: [],
  isFliping: false,
  isOver: false,
  showMode: false,
  level: "hard",
};

function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "toggleClickArrs": {
      return { ...state, clickArrs: Array.from(new Set([...state.clickArrs, ...action.payload])) };
      //   return { ...state, clickArrs: [...state.clickArrs, ...action.payload] };
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
    case "reset": {
      return {
        ...state,
        ...initialState,
      };
    }
    default:
      throw new Error();
  }
}

const Container = () => {
  const [{ flagArrs, clickArrs, isFliping, isOver, level, showMode }, dispatch]: any = useReducer(reducer, initialState);

  const { bombsAxisArrs, x, y, judgeGridType, reset } = useGenerate({ level: "hard" });

  console.log(bombsAxisArrs, "bombsAxisArrsbombsAxisArrsbombsAxisArrs");

  const getStyles = () => ({
    width: `${x * 30}px`,
    height: `${y * 30}px`,
    gridTemplateColumns: `repeat(${x}, 1fr)`,
    gridTemplateRows: `repeat(${y}, 1fr)`,
  });

  function resetGame() {
    reset();
    dispatch({ type: "reset" });
  }

  function toggleShow() {
    dispatch({ type: "setShowMode", payload: !showMode });
  }

  return (
    <Context.Provider value={{ flagArrs, clickArrs, dispatch, bombsAxisArrs, judgeGridType, isFliping }}>
      <div onClick={toggleShow}>{showMode ? "HIDE" : "SHOW"}</div>
      <div className={styles.container} style={getStyles()}>
        {Array.from({ length: x * y }, (_, index) => index).map((_, index) => (
          // <Grid y={Math.floor(index / x)} x={index % x} type={bombsAxisArrs.includes(index) ? GridType.bomb : GridType.empty} />
          <Grid key={index} index={index} y={Math.floor(index / x)} x={index % x} {...judgeGridType(index)} level={level} showMode={showMode} />
        ))}

        {isOver && <GameOver resetGame={resetGame} />}
      </div>
    </Context.Provider>
  );
};

export default Container;
