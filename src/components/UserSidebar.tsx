import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";
import { Calendar, Home, Plus, Book, Mail } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext";

export function UserSidebar() {

  const { userPath } = useAuth();

  let items = [
    {
      title: "Dashboard",
      url: `/${userPath}`,
      icon: Home,
    },
    {
      title: "Messages",
      url: `/${userPath}/messages`,
      icon: Mail,
    },
    {
      title: "Syllabus",
      url: `/${userPath}/syllabus`,
      icon: Calendar,
    }
  ]

  // userPath == "admin" && items.push({
  //   title: "Courses List",
  //   url: `/${userPath}/courses`,
  //   icon: Book,
  // })

  userPath != "student" && items.push({
    title: "Add Test",
    url: `/${userPath}/add-test`,
    icon: Plus,
  })

  return (
    <Sidebar className="bg-[#2a3c61] overflow-hidden text-white rounded-lg border border-white/10 shadow-lg">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="p-6 text-center text-xl font-bold text-white/90">
            <Link to={"/"}><img src="/Logo.png" alt="logo" /></Link>
          </SidebarHeader>
          <SidebarMenu className="mt-4 space-y-2">
            {items.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="hover:bg-white/10 rounded-md hover:text-black"
              >
                <SidebarMenuButton asChild className="flex items-center pl-12">
                  <Link
                    to={item.url}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-semibold text-sm">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center text-sm text-white/60 items-center">
        EduHub&reg;
      </SidebarFooter>
    </Sidebar>
  );

}