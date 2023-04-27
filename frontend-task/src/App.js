import { Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Error from "./pages/Error";
import "./app.scss"

function App() {
  return (
    <Routes>
      {/* main routes */}
      <Route path="/" element={<Home />} />
      {/* in-case user visits unknown page */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
