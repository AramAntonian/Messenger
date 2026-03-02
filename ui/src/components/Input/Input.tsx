import { useMemo, type Dispatch, type SetStateAction } from "react";
import "./Input.css";

interface InputParams {
  type?: "text" | "password" | "email";
  placeholder?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  size?: "large" | "small" | "medium";
}

function Input({ type, value, setValue, size, placeholder }: InputParams) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const defineStyle = useMemo(() => {
    const result = { width: "150px", height: "20px" };

    if (size === "medium") {
      result.width = "200px";
      result.height = "22px";
    }

    if (size === "large") {
      result.width = "250px";
      result.height = "30px";
    }

    return result;
  }, [size]);

  return (
    <>
      <input
        type={type ?? "text"}
        value={value}
        onChange={handleChange}
        className="input-input"
        style={defineStyle}
        placeholder={placeholder || ''}
      />
    </>
  );
}

export default Input;
