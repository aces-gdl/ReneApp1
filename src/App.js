import React from 'react';
import './App.css';
import {  Route, Switch } from 'react-router-dom';
import Brands from './components/catalogs/Brands';
import Catalogo2 from './components/catalogs/Catalogo2';
import Main from './components/Main';
import Landing from './components/Landing';


function App() {
  return (
    <div className="App">
       <Main/>
 
        <div>
          <Switch>
            <Route exact path={"/"} component={Landing} />
            <Route path={"/Brands"} component={Brands} />
            <Route path={"/cat2"} component={Catalogo2} />
          </Switch>
        </div>
    </div>
  );
}

export default App;
