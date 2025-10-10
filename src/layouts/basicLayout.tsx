import { Outlet } from "react-router"

const BasicLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}

export default BasicLayout
