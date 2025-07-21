// hooks/useCountryInput.js
import { useState } from "react";

export const useCountryInput = (countriesList) => {
  const [guess, setGuess] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setGuess(value);
    setSelectedIndex(-1);

    if (value.length > 0) {
      setFilteredCountries(
        countriesList
          .filter((country) =>
            country.countryName.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 5)
      );
    } else {
      setFilteredCountries([]);
    }
  };

  const handleKeyDown = (event) => {
    if (filteredCountries.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCountries.length - 1
      );
    } else if (event.key === "Enter") {
      if (selectedIndex >= 0) {
        event.preventDefault();
        handleSelectSuggestion(filteredCountries[selectedIndex]);
      }
    }
  };

  const handleSelectSuggestion = (country) => {
    setGuess(country.countryName);
    setFilteredCountries([]);
    setSelectedIndex(-1);
    document.getElementById("countryInput")?.focus();
  };

  const triggerWrongAnswer = () => {
    setError(true);
    setFilteredCountries([]);
    document.getElementById("countryInput")?.blur();
    setTimeout(() => {
      setError(false);
      document.getElementById("countryInput")?.focus();
    }, 500);
  };

  const clearInput = () => {
    setGuess("");
    setFilteredCountries([]);
    setSelectedIndex(-1);
    setError(false);
  };

  return {
    guess,
    filteredCountries,
    selectedIndex,
    error,
    handleInputChange,
    handleKeyDown,
    handleSelectSuggestion,
    triggerWrongAnswer,
    clearInput,
  };
};
