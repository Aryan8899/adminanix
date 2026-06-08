import { useState } from "react";
import Login from "./main/Login";
import Dashboard from "./main/Dashboard";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn
    ? <Dashboard onLogout={() => setLoggedIn(false)} />
    : <Login onLogin={() => setLoggedIn(true)} />;
}