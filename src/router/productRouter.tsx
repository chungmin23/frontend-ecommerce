import { lazy, Suspense } from "react"
import type { RouteObject } from "react-router"

const Loading = () => <div>Loading....</div>

const RecommendPage = lazy(() => import("../pages/product/recommendPage"))

const productRouter = (): RouteObject => {
  return {
    path: "product",
    children: [
      {
        path: "recommend",
        element: <Suspense fallback={<Loading/>}><RecommendPage/></Suspense>
      }
    ]
  }
}

export default productRouter
