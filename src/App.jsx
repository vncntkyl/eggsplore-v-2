import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { FunctionProvider } from "./context/FunctionContext";

function App() {
  return (
    <Router>
      <FunctionProvider>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </FunctionProvider>
    </Router>
  );
}

export default App;
