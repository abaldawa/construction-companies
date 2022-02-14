/**
 * @author Abhijit Baldawa
 */

import React, {
  ChangeEvent,
  CSSProperties,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useState
} from "react";
import {useEventCallback} from "../../../../hooks/useEventCallback";
import {useDidUpdate} from "../../../../hooks/useDidUpdate";

type SupportedInputTypes = Extract<HTMLInputTypeAttribute, "search" | "text" | "number" | "checkbox" | "date">;
export type OnInputChange<InputType> = (args: {
  inputValue: InputType;
  clearInput: () => void;
  name?: string;
}) => void;

interface InputProps<InputType> extends Pick<InputHTMLAttributes<HTMLInputElement>, "name">{
  type: SupportedInputTypes;
  onInputChange: OnInputChange<InputType>;
  style?: CSSProperties;
}

/**
 * A general purpose input component which can be of @see SupportedInputTypes.
 * It is a wrapper in native input component and provides additional functionality
 * such as below:
 *  1. Provides clear input function to programmatically clear the input
 *  2. Handles the input changes to correct data type based on SupportedInputTypes
 *  3. On UPDATE notifies the parent by 'field name', 'field value (correct data type)'
 *     and a 'clear input' function.
 *
 * @param type - supported types for this input field
 * @param name - name of this input field
 * @param style - user provided style to be applied to input
 * @param onInputChange - handle input changes
 *
 * @constructor
 */
export const Input = <InputType extends string | number | boolean>({
  type,
  name,
  style,
  onInputChange,
}: InputProps<InputType>) => {
  const [inputValue, setInputValue] = useState("" as InputType);

  const handleInputChange = useEventCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {value, checked} = e.target;

    switch (type) {
      case "number":
        setInputValue(+value as InputType);
        break;
      case "checkbox":
        setInputValue(checked as InputType);
        break;
      case "search":
      case "text":
      case "date":
      default:
        setInputValue(value as InputType);
        break;
    }
  });

  const clearInputValue = useEventCallback(() => {
    setInputValue("" as InputType);
  });

  useDidUpdate(() => {
    onInputChange({
      name,
      inputValue: inputValue as NonNullable<InputType>,
      clearInput: clearInputValue,
    });
  }, [inputValue]);

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    name,
    style,
    type,
    onChange: handleInputChange
  };

  if(type === "checkbox") {
    inputProps.checked = inputValue as boolean | undefined;
  } else {
    inputProps.value = inputValue as string | number | undefined;
  }

  return <input {...inputProps}/>;
};