import { FC, useContext, MouseEvent, useRef } from "react";
import { getValidSiblings } from "../hooks/useGenerate";
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

const Grid: FC<GridProps> = ({ type, amount, x, y, index, level, showMode, clickBomb, startCount }) => {
  const { clickArrs, flagArrs, isFliping, judgeGridType, dispatch } = useContext(Context);

  const getClassname = (x: number, y: number) => {
    if (y % 2) {
      if (x % 2) return styles.odd;
    } else {
      if (x % 2 === 0) return styles.odd;
    }
    return styles.even;
  };

  // 翻牌子
  function revealGrid(index: number, alreadyCheck = [] as any) {
    const params = level === "easy" ? [10, 8] : level === "medium" ? [18, 14] : [24, 20];
    const siblings = getValidSiblings(index, params[0], params[1]);

    const filterSiblings = getRestArrs(siblings, alreadyCheck);
    dispatch({ type: "toggleClickArrs", payload: [...siblings, index] });

    filterSiblings.filter((index) => judgeGridType(index).type === GridType.empty).forEach((item) => revealGrid(item, _.uniq([...siblings, ...alreadyCheck, index])));
  }

  const recursiveCheck = (index: number) => {
    const { type } = judgeGridType(index);

    // 带数字的格子
    if (type === GridType.around) {
      // 还没有click过的
      if (!clickArrs.length) startCount();
      return dispatch({ type: "toggleClickArrs", payload: [index] });
    }

    // 雷
    if (type === GridType.bomb) {
      return clickBomb(index);
    }

    if (!clickArrs.length) startCount();
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
          {flagArrs.includes(index) && <img src={flagPng} width={26} />}
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
