/**
 * @author Abhijit Baldawa
 */

import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  "@global": {
    body: {
      margin: 0,
      padding: 0,
      "fontFamily": `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    "*": {
      boxSizing: "border-box"
    }
  }
});

const CssBaseline = () => {
  useStyles();
  return null;
};

export { CssBaseline };
