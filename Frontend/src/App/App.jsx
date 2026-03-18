import "./App.css";
import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useAuth } from "../Features/Auth/Hooks/useAuth";

function App() {

  const { handlegetme } = useAuth()
  useEffect(() => {
    handlegetme()
  }, [])

  return (
    <RouterProvider router={routes} />
  )
}

export default App
