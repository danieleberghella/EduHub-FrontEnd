import { Outlet } from "react-router-dom"

export const Layout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen m-auto">
        <Outlet />
      </div>

    </>
  )
}
