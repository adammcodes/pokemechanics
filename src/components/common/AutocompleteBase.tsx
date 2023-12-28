import { useState } from "react";
import getSpriteUrl from "@/constants/spriteUrlTemplates";

interface AutocompleteProps {
  options: any[]; // this autocomplete doesn't care what the options are
  onSelect: (selectedValue: string | number) => void;
  defaultValue?: string;
  hasImageOptions?: boolean;
}

const AutocompleteBase: React.FC<AutocompleteProps> = ({
  options,
  defaultValue,
  onSelect,
  hasImageOptions = false,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const [filteredOptions, setFilteredOptions] = useState(options);
  // Toggle for showing options list
  const [showList, setShowList] = useState<Boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    filterOptions(inputValue);
  };

  const filterOptions = (inputValue: string) => {
    if (!inputValue) {
      setFilteredOptions(options);
      return;
    }
    const filteredOptions = options.filter((option) => {
      if (!inputValue) return true;
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    });
    setFilteredOptions(filteredOptions);
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedValue = event.currentTarget.name;
    // select DOM element with id of label
    const selectedLabel =
      event.currentTarget.querySelector("#label")?.textContent;

    if (!selectedValue || !selectedLabel) {
      console.error("No value or label found in selected option");
      console.log("selectedValue", selectedValue);
      console.log("selectedLabel", selectedLabel);
      return;
    }

    onSelect(selectedValue);
    setInputValue(selectedLabel);
    setShowList(false);
  };

  return (
    <div className="relative autocomplete">
      <input
        className="rby-dialogue-box"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search..."
        onFocus={() => setShowList(true)}
      />
      <i
        className={`dialogue-box-arrow ${showList ? "up" : ""}`}
        onClick={() => setShowList(!showList)}
      ></i>
      <ul
        className={`absolute overflow-y-auto max-h-screen w-full z-10 ${
          !showList ? "invisible" : "visible"
        }`}
      >
        {filteredOptions.map((option, i) => (
          <li key={option.value}>
            <button
              id={`${option.name}-${option.value}`}
              name={option.value?.toString()}
              className={`autocomplete-li-option p-1 m-0 w-full text-left flex justify-between items-center`}
              onClick={handleOptionClick}
            >
              <span id="label">
                {hasImageOptions ? `(#${option.value})` : ``} {option.label}
              </span>
              {hasImageOptions && (
                <img
                  src={getSpriteUrl({
                    versionGroup: option.versionGroup,
                    pokemonId: option.variantId || option.value,
                    generation: option.generationString.split("-")[1],
                  })}
                  alt="sprite"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteBase;
