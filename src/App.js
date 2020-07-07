import React from 'react';
import './App.css';
import {  Route, Switch } from 'react-router-dom';
import Brands from './components/catalogs/Brands';
import Main from './components/Main';
import Landing from './components/Landing';
import Models from './components/catalogs/Models';
import Vehicles from './components/catalogs/Vehicles';
import Items from './components/catalogs/Items';
//import Catalogo2 from './components/catalogs/Catalogo2';


function App() {
  return (
    <div className="App">
       <Main/>
 
        <div>
          <Switch>
            <Route exact path={"/"} component={Landing} >
            </Route>
            <Route path={"/Brands"} component={Brands} >
            </Route>
            <Route path={"/Models"} component={Models} >
            </Route>
            <Route path={"/Vehicles"} component={Vehicles}>
            </Route>
            <Route path={"/Items"} component={Items} >
            </Route>
          </Switch>
        </div>
    </div>
  );
}

export default App;
