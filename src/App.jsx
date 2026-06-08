import { useState } from "react";
import Login from "./main/Login";
import Dashboard from "./main/Dashboard";
import { getToken, removeToken } from "../api/api";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
  };

  return loggedIn
    ? <Dashboard onLogout={handleLogout} />
    : <Login onLogin={() => setLoggedIn(true)} />;
}