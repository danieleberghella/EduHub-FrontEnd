import UserCoursesList from "@/components/UserCoursesList"
import { useAuth } from "@/contexts/AuthContext"
import CoursesList from "./CoursesList";

export const Dashboard = () => {
  const { user } = useAuth();
  return (
    <>
      {user?.role && ["STUDENT", "TEACHER"].includes(user.role) &&
        <UserCoursesList />
        ||
        <CoursesList />
      }
    </>
  )
}
