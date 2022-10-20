import React, {useEffect} from "react";
import Home from "./screens/Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  useEffect(() => {
    document.title = "Bronco Projects"
  })
  return (
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />}/>
        </Routes>
      </Router>
      // Need to specify Browser Routes
      // Refer to: https://stackoverflow.com/questions/57058879/how-to-create-dynamic-routes-with-react-router-dom
      // Ex:
      // For Root(/)
      // bronco-projects.com/ => Home Screen

      // For project screen
      // bronco-projects.com/projects/{id} => Project Screen


  );
}

export default App;
