/**
 * @author Abhijit Baldawa
 */

import React, {memo} from 'react';
import {createUseStyles} from "react-jss";

interface GridResultInfoProps {
  currentlyShowing: number;
  totalRows: number;
  children?: never;
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "0.3rem"
  }
});

const GridResultInfoComponent: React.FC<GridResultInfoProps> = ({
  currentlyShowing,
  totalRows
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <span>Showing {currentlyShowing} of {totalRows}</span>
    </div>
  );
};

export const GridResultInfo = memo(GridResultInfoComponent) as typeof GridResultInfoComponent;
