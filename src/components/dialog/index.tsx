import { ReactNode, FC, useState, useEffect, useRef, CSSProperties } from "react";
import classnames from "classnames";
import styles from "./style.module.scss";
import { createRoot, Root } from "react-dom/client";

interface Button {
  type?: "default" | "primary";
  text?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
  action: () => void;
}

interface Props {
  title: ReactNode;
  content?: ReactNode;
  buttons?: Button[];
  visible: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  showClose?: boolean;
  closeOnOusideClick?: boolean;
  onAnimationend?: () => void;
}

interface Params extends Omit<Props, "message" | "children" | "visible"> {}

const Index: FC<Props> = ({ buttons = [], visible, title, content, showClose = true, onAnimationend, onClose, children }) => {
  const [show, setShow] = useState<boolean>(visible);
  const wrapperEl = useRef<HTMLDivElement>(null);

  const defaultButton: Button[] = [
    {
      type: "default",
      text: "取消",
      action: () => null,
    },
    {
      type: "primary",
      text: "确认",
      action: () => null,
    },
  ];

  buttons = buttons?.filter(Boolean).map((item, index) => {
    return {
      ...defaultButton[index],
      ...item,
    };
  });

  useEffect(toggleVisible, [visible]);

  function toggleVisible() {
    console.log(visible, "visiblevisiblevisiblevisible");
    const wrapper = wrapperEl.current;
    if (visible) {
      setShow(visible);
    } else {
      wrapper && (wrapper.onanimationend = animationend);
    }
  }

  function animationend() {
    setShow(false);
    onAnimationend && onAnimationend();
  }

  return show ? (
    <div className={classnames(styles.container, "animate__animated", visible ? "animate__fadeIn" : "animate__fadeOut")} ref={wrapperEl}>
      <div className={classnames(styles.wrapper, "animate__animated", visible ? "animate__zoomIn" : "animate__zoomOut")}>
        <div className={styles.title}>{title}</div>
        {showClose && (
          <div className={styles.close} onClick={onClose}>
            ×
          </div>
        )}
        <div className={styles.content}>{children || content}</div>
        {buttons.length && (
          <div className={styles.footer}>
            {buttons.map((button, index) => (
              <div key={index} onClick={button.action} className={classnames(styles.button, styles[button.type as any], { disabled: button.disabled }, button.className)}>
                {button.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

function open(instanceId: string, params: Params): Root {
  const div = document.createElement("div");
  div.setAttribute("id", instanceId);
  document.body.appendChild(div);
  const root = createRoot(div);
  root.render(<Index visible {...params} />);
  return root;
}

function hide(instanceId: string, params: Params, root: Root) {
  params.onAnimationend = () => {
    const container = document.getElementById(instanceId);
    container?.parentNode?.removeChild(container);
    root.unmount();
  };
  root.render(<Index visible={false} {...params} />);
}

function dialog(params: Params): () => void {
  const instanceId = `dialog_${Date.now()}`;
  const root = open(instanceId, params);

  return () => {
    hide(instanceId, params, root);
  };
}

export { dialog };

export default Index;
