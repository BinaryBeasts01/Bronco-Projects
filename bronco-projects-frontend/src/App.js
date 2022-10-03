import logo from './logo.svg';
import {useEffect} from "react";
import './App.css';

function App() {
  useEffect(() => {
    document.title = "Bronco Projects"
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Bronco Projects</h1>
        <h2>By Binary Beasts</h2>
        <p>Austin Lee</p>
      </header>
    </div>
  );
}

export default App;
