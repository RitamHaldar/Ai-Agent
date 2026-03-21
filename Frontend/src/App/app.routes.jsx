import { createBrowserRouter } from "react-router";
import Login from "../Features/Auth/Pages/Login";
import Register from "../Features/Auth/Pages/Register";
import Protected from "../Features/Auth/Components/Protected";
import Dashboard from "../Features/Chat/Pages/Dashboard";

export const routes = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Dashboard /></Protected>
    }
])