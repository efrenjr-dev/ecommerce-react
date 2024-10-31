import "./App.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// routes
import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import ViewProduct, { loader as productLoader } from "./pages/ViewProduct";
import Cart, { loader as cartLoader } from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Register from "./pages/Register";
import UpdateProduct from "./pages/UpdateProduct";
import ViewOrder, { loader as orderLoader } from "./pages/ViewOrder";
import VerifyEmail, { loader as verifyEmailLoader } from "./pages/VerifyEmail";

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
                path: "/cart",
                element: <Cart />,
                loader: cartLoader,
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
                // loader: productsLoader,
                children: [
                    {
                        path: "/products/:productId",
                        element: <ViewProduct />,
                        loader: productLoader,
                    },
                ],
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
                loader: orderLoader,
            },
            {
                path: "/verify-email/:token",
                element: <VerifyEmail />,
                loader: verifyEmailLoader,
            },
        ],
    },
]);

export default function App() {
    console.log("API URL", import.meta.env.VITE_API_URL);
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
