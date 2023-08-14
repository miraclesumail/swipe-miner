import { ChangeEvent, useContext, FC } from "react";
import { Context } from "@/components/container";
import classnames from "classnames";
import styles from "@/components/style.module.scss";
import flagPng from "@/assets/flag.png";
import clock from "@/assets/clock.png";
import * as Actions from "@/actions/types";

const Difficulty = [
  {
    value: "easy",
    text: "低难度",
  },
  {
    value: "medium",
    text: "中等难度",
  },
  {
    value: "hard",
    text: "高难度",
  },
];

const Nav: FC<any> = ({ resetGame, showMode, toggleShow, clearTimer, flagArrs, bombsAxisArrs, count }) => {
  const { dispatch, level } = useContext(Context);

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);

    if (e.target.value !== level) {
      resetGame();
      clearTimer();
      dispatch({ type: Actions.SET_LEVEL, payload: e.target.value });
    }
  };

  return (
    <div className={classnames(styles.nav, styles[level])}>
      <select onChange={onSelect}>
        {Difficulty.map((item) => (
          <option value={item.value} key={item.value}>
            {item.text}
          </option>
        ))}
      </select>
      <div onClick={toggleShow}>{showMode ? "HIDE" : "SHOW"}</div>

      <div>
        <img src={flagPng} alt="" width={30} />
        <span>{bombsAxisArrs.length - flagArrs.length}</span>
      </div>

      <div>
        <img src={clock} alt="" width={30} />
        <span>{count}</span>
      </div>
    </div>
  );
};

export default Nav;
