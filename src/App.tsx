import React, { Component } from "react";
import "./App.css";
import { Header, Meta, Player, Stats, Stream } from "./components";
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
