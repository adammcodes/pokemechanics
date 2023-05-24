import { useState, KeyboardEvent, useEffect } from "react";
import { GameOption, PokemonOption } from "../types";
import addPrecedingZeros from "../utils/addPrecedingZeros";

interface AutocompleteProps {
  options: GameOption[] | PokemonOption[];
  defaultValue: string;
  onSelect: (selectedValue: string | number) => void;
  isPokemonOption: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  defaultValue,
  onSelect,
  isPokemonOption,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [filteredOptions, setFilteredOptions] = useState<
    GameOption[] | PokemonOption[]
  >([]);
  // Toggle for showing options list
  const [showList, setShowList] = useState<Boolean>(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    filterOptions(inputValue);
  };

  const filterOptions = (inputValue: string) => {
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedValue = event.currentTarget.name;
    const selectedLabel = event.currentTarget.innerHTML;
    onSelect(selectedValue);
    setInputValue(selectedLabel);
    setShowList(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : options.length - 1
        );
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < options.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "Enter":
        if (showList && activeIndex !== -1) {
          event.preventDefault();
          onSelect(options[activeIndex].value);
          setInputValue(options[activeIndex].label);
          setShowList(false);
        }
        break;
      case "Escape":
        setShowList(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Reset active index when input value changes
    setActiveIndex(-1);
  }, [inputValue]);

  return (
    <div className="relative autocomplete">
      <input
        className="rby-dialogue-box"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search..."
        onFocus={() => setShowList(true)}
        onKeyDown={handleKeyDown}
      />
      <i
        className={`dialogue-box-arrow ${showList ? "up" : ""}`}
        onClick={() => setShowList(!showList)}
      ></i>
      <ul
        className={`absolute overflow-y-auto max-h-80 w-full ${
          !showList ? "invisible" : "visible"
        }`}
      >
        {filteredOptions.map((option, i) => (
          <li
            className={`autocomplete-li-option ${
              activeIndex === i ? "active" : ""
            }`}
            key={option.value}
          >
            <button
              id={`${option.name}-${option.number}`}
              name={option.value?.toString()}
              className="p-1 m-0 w-full text-left"
              onClick={handleOptionClick}
            >
              {option.number && isPokemonOption && (
                <>
                  <span>(#{addPrecedingZeros(option.number, 3)})</span>
                  <span>&nbsp;</span>
                </>
              )}
              {option.label}{" "}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
