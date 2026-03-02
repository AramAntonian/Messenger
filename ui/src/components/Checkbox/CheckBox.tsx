import { useMemo, type Dispatch, type SetStateAction } from "react";
import "./CheckBox.css";

interface CheckBoxParams {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  size?: "large" | "small" | "medium";
}

function CheckBox({ checked, setChecked, size }: CheckBoxParams) {
  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const defineStyle = useMemo(() => {
    const result = { width: "15px", height: "15px" };

    if (size === "medium") {
      result.width = "20px";
      result.height = "20px";
    }

    if (size === "large") {
      result.width = "30px";
      result.height = "30px";
    }

    return result;
  }, [size]);

  return (
    <div className="checkbox-cont">
      <div>Show Password</div>
      <input type="checkbox" checked={checked} onClick={handleChange} style={defineStyle} />
    </div>
  );
}

export default CheckBox;
