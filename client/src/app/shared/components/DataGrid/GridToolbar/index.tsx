/**
 * @author Abhijit Baldawa
 */

import React, {memo} from "react";
import {createUseStyles} from "react-jss";
import {MultiSelectCheckbox} from "../../UI/MultiSelectCheckBox";

interface GridToolbarProps {
  totalActiveFilters: number;
  columns: string[];
  selectedColumns: {[key: string]: string};
  onColumnShowOrHideHandler: (selectedColumns?: string[]) => void;
  clearActiveFilters: () => void;
  children?: never;
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  filterInfoContainer: {
    position: "relative",
    border: "1px solid black",
    margin: "0 10px"
  },
  clearFilterCta: {
    position: "absolute",
    top: "-11px",
    right: "-8px",
    borderRadius: "50%",
    width: "1rem",
    height: "1rem",
    display: "flex",
    justifyContent: "center",
    color: "white",
    background: "red",
    paddingBottom: "2px",
    alignItems: "center",
    cursor: "pointer"
  },
  columnListContainer: {
    width: "10rem"
  }
});

const GridToolbarComponent: React.FC<GridToolbarProps> = ({
  columns,
  selectedColumns,
  onColumnShowOrHideHandler,
  totalActiveFilters,
  clearActiveFilters
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {!!totalActiveFilters && (
        <div className={classes.filterInfoContainer}>
          <span>{totalActiveFilters} Filters</span>
          <span onClick={clearActiveFilters} className={classes.clearFilterCta}>
            x
          </span>
        </div>
      )}
      <div className={classes.columnListContainer}>
        <MultiSelectCheckbox
          values={columns}
          selectedValues={selectedColumns}
          alwaysShowSelectionText
          selectionText="Select columns:"
          onSelectionChange={onColumnShowOrHideHandler}
        />
      </div>
    </div>
  );
};

export const GridToolbar = memo(GridToolbarComponent) as typeof GridToolbarComponent;