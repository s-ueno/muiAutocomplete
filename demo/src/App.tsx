import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import MuiAutocomplete from "./muiAutocomplete";
import MuiTeme from "./muiTheme";

function App() {
  const [value, setValue] = useState("");
  return (
    <MuiTeme>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <MuiAutocomplete
            value={value}
            onInputChange={(e, v) => {
              setValue(v);
            }}
            onInputDone={(e, v) => {
              console.log(v);
            }}
            sx={{
              width: "300px",
            }}
          />

          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </MuiTeme>
  );
}

export default App;
