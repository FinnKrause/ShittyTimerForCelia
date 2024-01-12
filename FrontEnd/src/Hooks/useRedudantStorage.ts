import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useRedundantStorage<TYPE>(
  varName: string,
  _initialValue: TYPE,
  cssvar?: boolean,
  cssvarvaluesuffix?: string
): [TYPE, Dispatch<SetStateAction<TYPE>>] {
  const [value, setValue] = useState<TYPE>(() => {
    const localValue: TYPE = localStorage.getItem(varName) as TYPE;
    // console.log("Hello world " + typeof localValue);
    if (localValue) {
      console.log(
        "Read data from " +
          varName +
          " with result '" +
          localValue +
          "'. Inital state automatically set."
      );
      return localValue;
    } else {
      console.log(
        "Setting " +
          varName +
          " with '" +
          localValue +
          "'. Reverting back to provided value '" +
          _initialValue +
          "'"
      );
      return _initialValue;
    }
  });

  useEffect(() => {
    console.log(
      "Updated localStorage '" + varName + "' with value '" + value + "'"
    );
    localStorage.setItem(varName, value as string);
    if (cssvar)
      document.documentElement.style.setProperty(
        `--${varName}`,
        (value as string) + (cssvarvaluesuffix ? cssvarvaluesuffix : "")
      );
  }, [value, varName, cssvar, cssvarvaluesuffix]);

  return [value, setValue];
}

export default useRedundantStorage;
