import "./App.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// routes
import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import ViewProduct from "./pages/ViewProduct";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Orders from "./pages/Orders";
import Products, { loader as productsLoader } from "./pages/Products";
import Register from "./pages/Register";
import UpdateProduct from "./pages/UpdateProduct";
import ViewOrder from "./pages/ViewOrder";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product/:productId",
                element: <ViewProduct />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/addproduct",
                element: <AddProduct />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/logout",
                element: <Logout />,
            },
            {
                path: "/orders",
                element: <Orders />,
            },
            {
                path: "/products",
                element: <Products />,
                loader: productsLoader,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/updateproduct/:productId",
                element: <UpdateProduct />,
            },
            {
                path: "/order/:orderId",
                element: <ViewOrder />,
            },
        ],
    },
]);

export default function App() {
    console.log("API URL", import.meta.env.VITE_API_URL);
    return <RouterProvider router={router} />;
}
