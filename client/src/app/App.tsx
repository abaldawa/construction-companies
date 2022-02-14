/**
 * @author Abhijit Baldawa
 */

import React from 'react';
import {ConstructionCompanies} from "./modules/companies/containers/ConstructionCompanies";
import {CssBaseline} from "./shared/components/CssBaseline";
import {Layout} from "./shared/components/Layout";

function App() {
  return (
    <>
      <CssBaseline/>
      <Layout>
        <ConstructionCompanies/>
      </Layout>
    </>
  );
}

export default App;
