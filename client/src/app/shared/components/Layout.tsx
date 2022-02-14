/**
 * @author Abhijit Baldawa
 */

import React from 'react';
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    alignItems: "center"
  }
});

const Layout:React.FC = ({children}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {children}
    </div>
  );
};

export { Layout };
