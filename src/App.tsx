import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header";
import Meta from "./components/Meta";
import Player from "./components/Player";
import Stats from "./components/Stats";
import Stream from "./components/Stream";
import { Provider } from "./Store";

class App extends Component {
  render() {
    return (
      <Provider>
        <div className="App">
          <Header />
          <Player />
          <Meta />
          <Stats />
          <Stream />
        </div>
      </Provider>
    );
  }
}

export default App;
