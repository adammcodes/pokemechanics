import { useState } from "react";

type Option = {
  label: string;
  name: string;
  value: string | number;
  number: number;
};

type Props = {
  options: Option[];
  onSelect: (selectedValue: string | number, number: number) => void;
  defaultValue: string;
};

export default function Select(props: Props) {
  const [selectedValue, setSelectedValue] = useState<string | number>(
    props.defaultValue
  );

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let number = 0;
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];

    if (selectedOption) {
      number = Number(selectedOption.id.split("-").at(-1));
    }

    setSelectedValue(value);
    props.onSelect(value, number);
  };

  return (
    <div className="relative">
      <select
        className="rby-dialogue-box hide-select-arrow"
        value={selectedValue}
        onChange={handleSelectChange}
      >
        {props.options.map((option, index) => (
          <option
            id={`${option.name}-${option.number}`}
            key={index}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <i className="dialogue-box-arrow"></i>
    </div>
  );
}
