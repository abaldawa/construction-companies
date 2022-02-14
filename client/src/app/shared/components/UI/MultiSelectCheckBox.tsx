/**
 * @author Abhijit Baldawa
 */

import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {useDetectOutsideClick} from "../../hooks/useDetectOutsideClick";
import {useEventCallback} from "../../hooks/useEventCallback";
import {useDidUpdate} from "../../hooks/useDidUpdate";
import {createUseStyles} from "react-jss";

interface MultiSelectCheckboxProps {
  values: string[],
  alwaysShowSelectionText?: boolean;
  selectedValues?: {[key: string]: string};
  selectionText: string;
  onSelectionChange: (newSelections: string[] | undefined, clearSelections: () => void) => void
}

const useStyles = createUseStyles({
  container: {
    position: "relative",
    border: "1px solid black",
    borderRadius: "3px"
  },
  selectionTextContainer: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxHeight: "19px"
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    borderRadius: "0 0 3px 3px",
    listStyle: "none",
    background: "white",
    border: "1px solid",
    width: "100%",
    position: "absolute",
    top: "19px",
    maxHeight: "8rem",
    overflow: "scroll",
    zIndex: 1
  },
  listItem: {
    listStyle: "none",
    padding: 0,
    margin: 0
  }
});

export const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
  values,
  selectedValues = {},
  selectionText,
  alwaysShowSelectionText,
  onSelectionChange
}) => {
  const [selected, setSelected] = useState<{[key: string]: string}>(selectedValues);
  const checkboxRef = useRef<HTMLDivElement | null>(null);
  const outsideClickDetected = useDetectOutsideClick(checkboxRef);
  const classes = useStyles();
  const showSelectionList = typeof outsideClickDetected === "undefined" ? false : !outsideClickDetected;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.type === "checkbox") {
      const {checked: value, name} = e.target;

      if(value) {
        setSelected({...selected, [name]: name});
      } else {
        delete selected[name];
        setSelected({...selected});
      }
    }
  }

  const clearSelections = useEventCallback(() => {
    setSelected({});
  });

  useEffect(() => {
    const selectedKeys = Object.keys(selected);

    if(selectedKeys.length) {
      const selectedKeysToUpdate = selectedKeys
        .filter(k => values.includes(k))
        .reduce((acc, k) => {
          acc[k] = k;
          return acc;
        }, {} as Record<string, string>);
      setSelected(selectedKeysToUpdate);
    }
  }, [values]);

  useDidUpdate(() => {
    const newSelection = Object.values(selected);

    if(newSelection.length) {
      onSelectionChange(newSelection, clearSelections);
    } else {
      onSelectionChange(undefined, clearSelections);
    }
  }, [selected]);

  return (
    <>
      <div ref={checkboxRef} className={classes.container}>
        <div className={classes.selectionTextContainer}>
          {Object.keys(selected).length > 0 && !alwaysShowSelectionText ?
            Object.values(selected).join(", ") :
            selectionText
          }
        </div>
        {showSelectionList && (
          <li className={classes.listContainer}>
            {values.map(value => {
              return (
                <ul key={value} className={classes.listItem}>
                  <label>
                    <input type="checkbox" name={value} checked={!!selected[value]} onChange={handleInputChange}/>
                    {value}
                  </label>
                </ul>
              );
            })}
          </li>
        )}
      </div>
    </>
  );
};