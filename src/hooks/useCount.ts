import { useEffect, useRef, useState } from "react";

const useCount = (start = 0, auto = false) => {
  const [isAuto, setAuto] = useState<boolean>(auto);
  const [count, setCount] = useState<number>(start);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (isAuto) {
      timer.current = setTimeout(() => setCount(count + 1), 1000);
    }
    return () => clearTimeout(timer.current);
  }, [isAuto, count]);

  // 开始
  function startCount() {
    setAuto(true);
  }

  // 暂停
  function stop() {
    setAuto(false);
  }

  // 重置
  function reset() {
    setAuto(false);
    setCount(start);
  }

  return {
    count,
    startCount,
    reset,
    stop,
  };
};

export default useCount;
