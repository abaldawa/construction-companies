import React from 'react';
import {createUseStyles} from "react-jss";
import {ColumnSortOrder} from "../index";

interface ColumnSortArrowProps {
  sortOrder: ColumnSortOrder;
  onSortClick: () => void;
  children?: never;
}

interface ColumnSortArrowStyleProps {
  sortOrder: ColumnSortOrder;
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "0 5px",
    cursor: "pointer"
  },
  upArrow: {
    width: 0,
    height: 0,
    border: "5px solid transparent",
    background: "transparent",
    borderBottom: ({sortOrder}: ColumnSortArrowStyleProps) =>
      `solid 7px ${sortOrder === "ASC" ? "black" : "#00000040"}`,
    borderTopWidth: 0
  },
  downArrow: {
    width: 0,
    height: 0,
    border: "5px solid transparent",
    background: "transparent",
    borderTop: ({sortOrder}: ColumnSortArrowStyleProps) =>
      `solid 7px ${sortOrder === "DES" ? "black" : "#00000040"}`,
    borderBottomWidth: 0,
    marginTop: "1px"
  }
});

const ColumnSortArrow: React.FC<ColumnSortArrowProps> = ({
  sortOrder,
  onSortClick
}) => {
  const classes = useStyles({sortOrder});

  return (
    <div className={classes.container} onClick={onSortClick}>
      <span className={classes.upArrow} />
      <span className={classes.downArrow} />
    </div>
  );
};

export {ColumnSortArrow};
