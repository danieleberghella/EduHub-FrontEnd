import { Routes, Route } from "react-router-dom";
import { Layout } from "@/layouts/Layout";
import Homepage from "@/pages/Homepage";
import SignUp from "@/pages/auth/SignUp";
import NotFound from "@/pages/NotFound";
import { Messages } from "@/pages/Messages";
import { CourseStudents } from "@/components/CourseStudents";
import { CourseTeachers } from "@/components/CourseTeachers";
import { Syllabus } from "@/pages/Syllabus";
import { Settings } from "@/pages/Settings";
import Login from "@/pages/auth/Login";
import { useAuth } from "@/contexts/AuthContext";
import { CourseDetails } from "@/pages/CourseDetails";
import CoursesList from "@/pages/CoursesList";
import AddTest from "@/pages/AddTest";
import TakeTest from "@/pages/TakeTest";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { TestResults } from "./pages/TestResults";

function App() {

  const { userPath } = useAuth();

  return (
    <>

      <Routes>
        {/* Paths*/}
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />

          <Route path={`${userPath}`} element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-test" element={<AddTest />} />
            <Route path="messages" element={<Messages />} />
            <Route path="syllabus" element={<Syllabus />} />
            <Route path="settings" element={<Settings />} />
            <Route path="courses" >
              <Route index element={<CoursesList />} />
              <Route path=":course-name" element={<CourseDetails />} >
                <Route path="students" element={<CourseStudents />} />
                <Route path="teachers" element={<CourseTeachers />} />
              </Route>
            </Route>
            <Route path=":test-title" element={<TakeTest />} />
            <Route path=":test-title/results" element={<TestResults />} />

          </Route>


          {/* <Route path="teacher" element={<Dashboard />} >
            <Route path="course" element={<Courses />} >
              <Route path=":id" element={<CourseDetails />} >

              </Route>
            </Route>
            <Route path="test" >
              <Route path=":test-name" element={<TakeTest />} />

            </Route>
          </Route>


          
          <Route path="student" element={<Dashboard />}>
            <Route path="test" >
              <Route path=":test-name" element={<TakeTest />} />

            </Route>
            <Route path="course" element={<Courses />} >
              <Route path=":id" element={<CourseDetails />} >

              </Route>
            </Route>
          </Route>  */}

          {/*Auth Paths*/}
          <Route path="/auth">
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  )
}

export default App
