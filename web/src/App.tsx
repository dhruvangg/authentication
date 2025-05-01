import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import PublicLayout from "./Components/PublicLayout";
import { AuthLayout } from "./Components/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<h1>Register</h1>} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<h1>Settings</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App