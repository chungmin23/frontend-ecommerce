import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { MainLayout } from "../layouts/MainLayout";

const Loading = () => <div className="flex items-center justify-center min-h-screen"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div></div>

const HomePage = lazy(() => import("../pages/HomePage"))
const ProductListPage = lazy(() => import("../pages/ProductListPage"))
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"))

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
      }
    ]
  }
]);

export default router
 