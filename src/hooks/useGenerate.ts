import { useMemo, useCallback, useState } from "react";
import { GridType } from "@/components/grid";

type Props = {
  level: "easy" | "medium" | "hard";
};

/**
 * 获取是雷的坐标点
 * @param arrs
 * @param total total amount of bombs
 * @returns
 */
function getNumArrs(arrs: number[], total: number) {
  const result = [];
  const tempArrs = [...arrs];
  while (result.length < total) {
    const index = Math.floor(Math.random() * tempArrs.length);
    result.push(tempArrs[index]);
    tempArrs.splice(index, 1);
  }
  return result;
}

/**
 * 获取有效相邻鸽子的坐标
 * @param index target grid
 * @param x
 * @param y
 * @returns
 */
export function getValidSiblings(index: number, x: number, y: number) {
  const arrs = [];
  const [_x, _y] = [index % x, Math.floor(index / x)];

  if (_x > 0 && _y > 0) {
    arrs.push(index - (x + 1));
  }

  if (_y > 0) {
    arrs.push(index - x);
  }

  if (_x < x - 1 && _y > 0) {
    arrs.push(index - (x - 1));
  }

  if (_x > 0) {
    arrs.push(index - 1);
  }

  if (_x < x - 1) {
    arrs.push(index + 1);
  }

  if (_x > 0 && _y < y - 1) {
    arrs.push(index + x - 1);
  }

  if (_y < y - 1) {
    arrs.push(index + x);
  }

  if (_x < x - 1 && _y < y - 1) {
    arrs.push(index + x + 1);
  }

  return arrs;
}

/**
 * 10 * 8 easy
 * 18* 14 medium
 * 24* 20 hard
 * @returns
 */
const useGenerate = ({ level }: Props) => {
  const [dateTime, setDateTime] = useState(Date.now());

  const bombsAmount = useMemo(() => (level === "easy" ? 10 : level === "medium" ? 40 : 99), [level]);

  const [x, y] = useMemo(() => (level === "easy" ? [10, 8] : level === "medium" ? [18, 14] : [24, 20]), [level]);

  // 根据刷新时间重新生成
  const bombsAxisArrs = useMemo(() => {
    const arrs = Array.from({ length: x * y }, (_, index) => index);
    return getNumArrs(arrs, bombsAmount).sort((a, b) => a - b);
  }, [x, y, bombsAmount, dateTime]);

  const gridArrs = useMemo(() => {
    return Array.from({ length: y }, (_, index) => {
      return Array.from({ length: x }, (_, order) => [index, order]);
    });
  }, [x, y]);

  function getBombsCount(index: number) {
    const arrs = getValidSiblings(index, x, y);

    return arrs.filter((item) => bombsAxisArrs.includes(item)).length;
  }

  // 重置
  function reset() {
    setDateTime(Date.now());
  }

  // 判断格子的类型
  const judgeGridType = useCallback(
    (index: number) => {
      if (bombsAxisArrs.includes(index)) {
        return { type: GridType.bomb, amount: 0 };
      }

      const bombs = getBombsCount(index);

      return {
        type: bombs === 0 ? GridType.empty : GridType.around,
        amount: bombs,
      };
    },
    [bombsAxisArrs, x, y]
  );

  return {
    bombsAxisArrs,
    gridArrs,
    judgeGridType,
    reset,
    x,
    y,
  };
};

export default useGenerate;
