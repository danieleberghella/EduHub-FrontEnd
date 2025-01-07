import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import ICourse from "@/interfaces/Course"
import { useCourse } from "@/contexts/CourseContext"
import { useAuth } from "@/contexts/AuthContext"

interface CourseCardProps {
  course: ICourse
}

const CourseCard = ({ course }: CourseCardProps) => {

  const { setCourse } = useCourse();
  const { userPath } = useAuth();

  const handleSetCourse = (course: ICourse) => {
    localStorage.setItem("course", JSON.stringify(course))
    setCourse(course);
  }

  return (
    <Card className="flex flex-col max-w-80">
      <CardContent className="p-4">
        <div className="mb-4">
          <img
            src={`/courses/${course.name}.jpeg`}
            alt={course.name}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
        <p className="text-sm text-gray-600">{course.description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link to={`/${userPath}/courses/${course.name}`} className="w-full">
          <Button className="w-full" onClick={() => handleSetCourse(course)}>Check Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CourseCard

