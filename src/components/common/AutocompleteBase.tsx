"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
import { optionSpriteSizesByVersion } from "@/constants/spriteSizesByVersion";
import styles from "./Autocomplete.module.css";

interface AutocompleteProps {
  options: any[]; // this autocomplete doesn't care what the options are
  onSelect: (selectedValue: string | number) => void;
  defaultValue?: string | number;
  hasImageOptions?: boolean;
  linkTemplate?: string; // Template for Link href, e.g., "/pokedex/{value}"
}

const AutocompleteBase: React.FC<AutocompleteProps> = ({
  options,
  defaultValue,
  onSelect,
  hasImageOptions = false,
  linkTemplate,
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

  // Create an event listener that closes the dropdown when the user clicks outside of it
  useEffect(() => {
    // callback function for outside click
    const onOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.autocomplete}`)) {
        setShowList(false);
      }
    };

    // callback for escape key
    const onEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowList(false);
      }
    };

    // Close the dropdown if the user presses the escape key
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setShowList(false);
      }
    });

    // Close the dropdown if the user presses the escape key
    window.addEventListener("keydown", onEscapeKey);
    // Close the dropdown if the user clicks outside of it
    window.addEventListener("click", onOutsideClick);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("click", onOutsideClick);
      window.removeEventListener("keydown", onEscapeKey);
    };
  }, []);

  return (
    <div className={`${styles.container} m-auto lg:w-[340px] h-[2em]`}>
      <div
        className={`card__border overflow-hidden ${styles.autocomplete} ${
          showList ? "max-h-[500px] lg:absolute relative z-40" : "max-h-[2em]"
        }`}
      >
        <div className={`relative p-2 flex items-center`}>
          <input
            type="text"
            className={`font-bold bg-transparent w-full`}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search..."
            onFocus={() => setShowList(true)}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              // select all text in the input
              (e.target as HTMLInputElement).select();
            }}
          />
          <i
            className={styles.dialogueBoxArrow}
            style={{
              zIndex: 0,
              transform: showList ? "rotate(180deg)" : "rotate(0deg)",
              top: showList ? "12px" : "22px",
              scale: "1.1",
            }}
            onClick={() => setShowList(!showList)}
          ></i>
        </div>
        <ul
          className={`overflow-scroll ${showList ? "max-h-[400px]" : "hidden"}`}
        >
          {filteredOptions.map((option) => {
            const href = linkTemplate
              ? linkTemplate
                  .replace("{value}", option.value?.toString() || "")
                  .replace("{dexId}", option.dexId?.toString() || "")
                  .replace("{game}", option.game?.toString() || "")
                  .replace("{pokemonId}", option.pokemonId?.toString() || "")
                  .replace("{variantId}", option.variantId?.toString() || "")
              : undefined;

            const OptionContent = () => (
              <>
                <span id="label">
                  {hasImageOptions
                    ? `(#${option.pokemonId || option.value})`
                    : ``}{" "}
                  {option.label}
                </span>
                {hasImageOptions && (
                  <div className="flex justify-center items-center overflow-hidden">
                    <img
                      width={
                        optionSpriteSizesByVersion[option.versionGroup] || 50
                      }
                      src={getSpriteUrl({
                        versionGroup: option.versionGroup,
                        pokemonId: option.variantId || option.value,
                        generation: option.generationString.split("-")[1],
                      })}
                      alt="sprite"
                    />
                  </div>
                )}
              </>
            );

            return (
              <li key={option.value}>
                {href ? (
                  <Link
                    href={href}
                    className={`${styles.autocomplete__li__btn} border-0 px-2 py-1 m-0 w-full text-left flex justify-between items-center block`}
                    onClick={() => {
                      onSelect(option.value);
                      setInputValue(option.label);
                      setShowList(false);
                    }}
                  >
                    <OptionContent />
                  </Link>
                ) : (
                  <button
                    id={`${option.name}-${option.value}`}
                    name={option.value?.toString()}
                    className={`${styles.autocomplete__li__btn} border-0 px-2 py-1 m-0 w-full text-left flex justify-between items-center`}
                    onClick={handleOptionClick}
                  >
                    <OptionContent />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AutocompleteBase;
