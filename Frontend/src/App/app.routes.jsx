import { createBrowserRouter } from "react-router";
import Login from "../Features/Auth/Pages/Login";
import Register from "../Features/Auth/Pages/Register";
import Verify from "../Features/Auth/Pages/Verify";
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
        path: "/verify",
        element: <Verify />
    },
    {
        path: "/",
        element: <Protected><Dashboard /></Protected>
    },
])