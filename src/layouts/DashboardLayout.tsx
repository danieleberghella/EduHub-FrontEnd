import { UserSidebar } from "@/components/UserSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AvatarDropDown from "../components/AvatarDropDown";
import { BreadCrumb } from "../components/BreadCrumb";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <>
      <SidebarProvider>
        <UserSidebar />
        <div className="flex flex-col w-full">
          <div className="flex w-full">
            <div className="flex w-full justify-between items-center p-4 mr-10">
              <div className="flex justify-center items-center">
                <SidebarTrigger className="md:hidden block" />
                <BreadCrumb />
              </div>
              <AvatarDropDown />
            </div>
          </div>
          <hr />
          <div className="bg-homepage-background min-h-[calc(100vh-73px)]">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}