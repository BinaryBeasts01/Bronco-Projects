import {useEffect} from "react";
import Home from "./screens/Home"

function App() {
  useEffect(() => {
    document.title = "Bronco Projects"
  })
  return (
    <Home />
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
