import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  onSelect: (selectedValue: string) => void;
};

export default function Select(props: Props) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    props.onSelect(value);
  };

  return (
    <select
      className="border border-gray-300 py-1 px-1"
      value={selectedValue}
      onChange={handleSelectChange}
    >
      {props.options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
