import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { MainLayout } from "../layouts/MainLayout";

const Loading = () => <div className="flex items-center justify-center min-h-screen"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div></div>

const HomePage = lazy(() => import("../pages/HomePage"))
const ProductListPage = lazy(() => import("../pages/product/ProductListPage"))
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetailPage"))
const LoginPage = lazy(() => import("../pages/auth/LoginPage"))
const SignupPage = lazy(() => import("../pages/auth/SignupPage"))
const CartPage = lazy(() => import("../pages/cart/CartPage"))
const MyPage = lazy(() => import("../pages/user/MyPage"))

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
      }
    ]
  }
]);

export default router
 