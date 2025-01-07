import { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from '@/components/CourseCard'
import ICourse from '@/interfaces/Course';
import { useAlert } from '@/contexts/AlertContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function CoursesList() {
    const { showAlert } = useAlert();
    const [courses, setCourses] = useState<ICourse[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/courses`)
            .then(response => setCourses(response.data))
            .catch(() => showAlert("Error!",'An error occurred while fetching courses', "destructive"))
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-xs md:max-w-6xl">
            <h1 className="text-3xl font-bold mb-6">Courses List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                ))}
            </div>
        </div>
    );
}

