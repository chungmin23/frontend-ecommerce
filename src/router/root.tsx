import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { AdminLayout } from "../layouts/AdminLayout";

const Loading = () => <div className="flex items-center justify-center min-h-screen"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div></div>

const HomePage = lazy(() => import("../pages/HomePage"))
const ProductListPage = lazy(() => import("../pages/product/ProductListPage"))
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetailPage"))
const LoginPage = lazy(() => import("../pages/auth/LoginPage"))
const SignupPage = lazy(() => import("../pages/auth/SignupPage"))
const CartPage = lazy(() => import("../pages/cart/CartPage"))
const MyPage = lazy(() => import("../pages/user/MyPage"))
const AdminPage = lazy(() => import("../pages/admin/AdminPage"))
const OrderListPage = lazy(() => import("../pages/order/OrderListPage"))
const OrderDetailPage = lazy(() => import("../pages/order/OrderDetailPage"))
const OrderCheckoutPage = lazy(() => import("../pages/order/OrderCheckoutPage"))

const router = createBrowserRouter([
  {
    path: "",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading/>}><HomePage/></Suspense>
      },
      {
        path: "products",
        element: <Suspense fallback={<Loading/>}><ProductListPage/></Suspense>
      },
      {
        path: "products/:id",
        element: <Suspense fallback={<Loading/>}><ProductDetailPage/></Suspense>
      },
      {
        path: "login",
        element: <Suspense fallback={<Loading/>}><LoginPage/></Suspense>
      },
      {
        path: "signup",
        element: <Suspense fallback={<Loading/>}><SignupPage/></Suspense>
      },
      {
        path: "cart",
        element: <Suspense fallback={<Loading/>}><CartPage/></Suspense>
      },
      {
        path: "mypage",
        element: <Suspense fallback={<Loading/>}><MyPage/></Suspense>
      },
      {
        path: "orders",
        element: <Suspense fallback={<Loading/>}><OrderListPage/></Suspense>
      },
      {
        path: "orders/:id",
        element: <Suspense fallback={<Loading/>}><OrderDetailPage/></Suspense>
      },
      {
        path: "checkout",
        element: <Suspense fallback={<Loading/>}><OrderCheckoutPage/></Suspense>
      }
    ]
  },
  {
    path: "admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading/>}><AdminPage/></Suspense>
      }
    ]
  }
]);

export default router
 