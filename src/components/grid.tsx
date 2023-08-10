import { FC, useContext, MouseEvent, useRef } from "react";
import useGenerate, { getValidSiblings } from "../hooks/useGenerate";
import _ from "lodash";
import flagPng from "../assets/flag.png";
import { Context } from "./container";
import styles from "./style.module.scss";

function getRestArrs(a: number[], b: number[]) {
  return a.filter((item) => !b.includes(item));
}

export enum GridType {
  bomb,
  empty,
  around,
}

interface GridProps {
  type: GridType;
  amount?: number;
  x: number;
  y: number;
  index: number;
  level: string;
  showMode: boolean;
  [key: string]: any;
}

const Grid: FC<GridProps> = ({ type, amount, x, y, index, level, showMode, checked, setChecked }) => {
  const timer = useRef<any>(null);

  const { clickArrs, flagArrs, isFliping, bombsAxisArrs, judgeGridType, dispatch } = useContext(Context);

  const getClassname = (x: number, y: number) => {
    if (y % 2) {
      if (x % 2) return styles.odd;
    } else {
      if (x % 2 === 0) return styles.odd;
    }
    return styles.even;
  };

  function toggleAllBomb(copyBombArrs: number[]) {
    clearTimeout(timer.current);
    if (!copyBombArrs.length) return dispatch({ type: "setIsOver", payload: true });

    const targetIndex = copyBombArrs.shift() as number;
    if (!clickArrs.includes(targetIndex)) {
      dispatch({ type: "toggleClickArrs", payload: [targetIndex] });
    }
    timer.current = setTimeout(() => toggleAllBomb(copyBombArrs), 100);
  }

  // 翻牌子
  function revealGrid(index: number, alreadyCheck = [] as any) {
    const params = level === "normal" ? [10, 8] : [18, 14];
    const siblings = getValidSiblings(index, params[0], params[1]);

    const filterSiblings = getRestArrs(siblings, alreadyCheck);
    dispatch({ type: "toggleClickArrs", payload: [...siblings, index] });

    filterSiblings.filter((index) => judgeGridType(index).type === GridType.empty).forEach((item) => revealGrid(item, [...siblings, ...alreadyCheck, index]));
  }

  const recursiveCheck = (index: number) => {
    const { type } = judgeGridType(index);

    // 带数字的格子
    if (type === GridType.around) {
      return dispatch({ type: "toggleClickArrs", payload: [index] });
    }

    // 雷
    if (type === GridType.bomb) {
      console.log("GridType.bombGridType.bomb");
      dispatch({ type: "setIsFliping" });
      dispatch({ type: "toggleClickArrs", payload: [index] });

      const copyBombArrs = [...bombsAxisArrs].filter((item) => item !== index);
      timer.current = setTimeout(() => toggleAllBomb(copyBombArrs), 100);
      return;
    }
    dispatch({ type: "toggleClickArrs", payload: [index] });
    // 空格
    revealGrid(index);
  };

  const onClick = () => {
    if (isFliping) return;

    if (clickArrs.includes(index) || flagArrs.includes(index)) {
      return;
    } else {
      recursiveCheck(index);
    }
  };

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    dispatch({ type: "toggleFlagArrs", payload: index });
  };

  const renderGrid = () => {
    if (!clickArrs.includes(index) && !showMode) {
      return (
        <div className={styles.notOpen} onClick={onClick} onContextMenu={onContextMenu}>
          {flagArrs.includes(index) && <img src={flagPng} width={20} />}
        </div>
      );
    }

    switch (type) {
      case GridType.empty: {
        return <div className={getClassname(x, y)}></div>;
      }
      case GridType.bomb: {
        return <div className={styles.bomb}></div>;
      }
      case GridType.around: {
        return <div className={styles.text}>{amount}</div>;
      }
    }
  };

  return renderGrid();
};

export default Grid;
