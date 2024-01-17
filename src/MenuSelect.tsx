import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import "./menu-select.css";

interface MenuSelectProps {
  options: string[];
  onSelect: (option: string) => void;
  classNameContainer?: string;
  classNameButton?: string;
  classNameList?: string;
  classNameItem?: string;
}

export const MenuSelect: React.FC<MenuSelectProps> = ({
  options,
  onSelect,
  classNameContainer,
  classNameButton,
  classNameList,
  classNameItem,
}) => {
  const FIRST_OPTION = options[0];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(FIRST_OPTION);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      handleToggle();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLLIElement>, option: string) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect(option);
    } else if (e.key === "ArrowUp" && option !== options[0]) {
      const index = options.indexOf(option);
      handleSelect(options[index - 1]);
    } else if (
      e.key === "ArrowDown" &&
      option !== options[options.length - 1]
    ) {
      const index = options.indexOf(option);
      handleSelect(options[index + 1]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
      <section
        className={classNameContainer}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={menuRef}
      >
        <button
          className={classNameButton}
          type="button"
          onClick={handleToggle}
          aria-haspopup="true"
          aria-expanded={isOpen}
          tabIndex={-1}
        >
          {selectedOption}
        </button>
        {isOpen && (
          <ul className={classNameList} role="menu">
            {options.map((option, index) => (
              <li
                className={classNameItem}
                style={{ cursor: "pointer" }}
                key={index}
                tabIndex={0}
                role="menuitem"
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </section>
  );
};
