import { useMemo } from "react";
import './Button.css'

interface ButtonParams {
  text: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  size?: "large" | "small" | "medium";
}

function Button({ text, onClick, size }: ButtonParams) {
  const defineStyle = useMemo(() => {
    const result = { width: "150px", padding: '5px 0' };

    if (size === "medium") {
      result.width = "200px";
      result.padding = '8px 0'
    }

    if (size === "large") {
      result.width = "100%";
    }

    return result;
  }, [size]);

  return (
    <>
      <div style={defineStyle} onClick={onClick} className="button-button">
        {text}
      </div>
    </>
  );
}
export default Button;
