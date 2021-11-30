import React from 'react';
import './App.css';
import Fractals from "./Fractals/Fractals";
import ColorModels from "./ColorModels/ColorModels";
import Animations from "./Animations/Animations";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Main from "./Main";
import FractalLearn from "./Fractals/FractalLearn";
import ColorModelsLearn from "./ColorModels/ColorModelsLearn";

function App() {
  return (
      <Router>
        <Switch>
          {/*<Route path="/">*/}
          {/*  <SplashScreen />*/}
          {/*</Route>*/}
          <Route path="/" exact>
            <Redirect to="/main"/>
          </Route>
          <Route path="/main">
            <Main />
          </Route>
          <Route path="/fractals/learn">
            <FractalLearn/>
          </Route>
          <Route path="/fractals">
            <Fractals/>
          </Route>
          <Route path="/colors/learn">
            <ColorModelsLearn />
          </Route>
          <Route path="/colors">
            <ColorModels />
          </Route>
          <Route path="/animations">
            <Animations />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
