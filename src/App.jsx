import "./App.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

// routes
import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import ViewProduct, { loader as productLoader } from "./pages/ViewProduct";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Register from "./pages/Register";
import UpdateProduct, {
    loader as updateProductLoader,
} from "./pages/UpdateProduct";
import ViewOrder, { loader as orderLoader } from "./pages/ViewOrder";
import VerifyEmail, { loader as verifyEmailLoader } from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProductInventory, {
    loader as productInventoryLoader,
} from "./pages/ProductInventory";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import UpdateUser, { loader as updateUserLoader } from "./pages/UpdateUser";
import UserAccount, { loader as userAccountLoader } from "./pages/UserAccount";
import ViewProductHome, {
    loader as viewProductLoader,
} from "./pages/ViewProductHome";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
                children: [
                    {
                        path: "/product/:productId",
                        element: <ViewProductHome />,
                        loader: viewProductLoader,
                    },
                ],
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "/reset-password/:token",
                element: <ResetPassword />,
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
                element: <Orders take={10} title="Orders" />,
            },
            {
                path: "/products",
                element: <Products take={16} />,
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
                path: "/update-product/:productId",
                element: <UpdateProduct />,
                loader: updateProductLoader,
            },
            {
                path: "/product-inventory/:productId",
                element: <ProductInventory />,
                loader: productInventoryLoader,
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
            {
                path: "/users",
                element: <Users />,
            },
            {
                path: "/adduser",
                element: <AddUser />,
            },
            {
                path: "/updateuser/:userId",
                element: <UpdateUser />,
                loader: updateUserLoader,
            },
            {
                path: "/account",
                element: <UserAccount />,
                loader: userAccountLoader,
            },
        ],
    },
]);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
