import React from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path={"/"}>
          <Home />
        </Route>
        <Route exact path={"/admin"}>
          <Admin />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
