import { TextFieldDebounceOutlined } from "../../Utils/TextFieldDebounce";

export const NumberCoordField = ({
  value,
  setValue,
  label,
}: {
  value: number,
  setValue: (v: number) => void,
  label: string,
}) => {
  return (
    <TextFieldDebounceOutlined
      label={label}
      type="number"
      value={Math.round(value * 1e8) / 1e8}
      onChange={v => {
        const n = parseFloat(v);
        if (isFinite(n)) {
          setValue(n);
        }
      }} />
  );
};
