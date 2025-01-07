import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import ICourse from "@/interfaces/Course";
import axios from "axios";
import IUser from "@/interfaces/User";
import ISubject from "@/interfaces/Subject";
import IFile from "@/interfaces/File";
import { useAlert } from "./AlertContext";

const API_URL = import.meta.env.VITE_API_URL;

interface ICourseContextProps {
    course: ICourse | undefined,
    setCourse: (course: ICourse) => void;
    subjectsInCourse: ISubject[] | undefined,
    subjectsNotInCourse: ISubject[] | undefined,
    fetchSubjectsByCourseId: (courseId: string | undefined, isEnrolled: boolean) => void;
    enrolledUsers: IUser[] | undefined,
    notEnrolledUsers: IUser[] | undefined,
    fetchUsers: (courseId: string | undefined, isEnrolled: boolean) => void;
    loadedFiles: IFile[] | undefined,
    fetchFiles: (id: string | undefined) => void;
    handleDownloadFile: (fileId: string | undefined, fileName: string | undefined) => void;
    handleDeleteEnrollmentOrSubject: (id: string | undefined, type: string) => void;
    handleDeleteFile: (id: string | undefined) => void;
    loading: boolean,
}

const CourseContext = createContext<ICourseContextProps | null>(null);

export const useCourse = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error("useCourse must be used inside CourseProvider");
    }
    return context;
};

export const CourseProvider = ({ children }: { children: ReactNode }) => {
    const { showAlert } = useAlert();
    const [course, setCourse] = useState<ICourse>();
    const [enrolledUsers, setEnrolledUsers] = useState<IUser[]>([]);
    const [notEnrolledUsers, setNotEnrolledUsers] = useState<IUser[]>([]);
    const [subjectsInCourse, setSubjectsInCourse] = useState<ISubject[]>([]);
    const [subjectsNotInCourse, setNotSubjectsInCourse] = useState<ISubject[]>([]);
    const [loadedFiles, setFiles] = useState<IFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const course: ICourse = JSON.parse(localStorage.getItem('course') as string);
        if (course) {
            axios.get(`${API_URL}/courses/${course.id}`)
                .then(response => {
                    setCourse(response.data);
                    setLoading(false);
                })
                .catch(() => showAlert("An Error Occurred!", 'Error fetching course data', 'destructive'))
        }
    }, [])

    const fetchSubjectsByCourseId = async (courseId: string | undefined, isEnrolled: boolean) => {
        if (!courseId) return;
        try {
            const response = await axios.get(`${API_URL}/subject-course/course/${courseId}`, {
                params: { isEnrolled },
            });
            if (isEnrolled) {
                setSubjectsInCourse(response.data);
            } else {
                setNotSubjectsInCourse(response.data);
            }
            setLoading(false);
        } catch (err) {
            showAlert("An Error Occurred!", 'Error fetching subjects', 'destructive');
        }
    };

    const fetchUsers = async (courseId: string | undefined, isEnrolled: boolean) => {
        if (!courseId) return;
        try {
            const response = await axios.get(`${API_URL}/users/course/${courseId}`, {
                params: { isEnrolled },
            });
            if (isEnrolled) {
                setEnrolledUsers(response.data);
            } else {
                setNotEnrolledUsers(response.data);
            }
            setLoading(false);
        } catch (err) {
            showAlert("An Error Occurred!", 'Error fetching users', 'destructive');
        }
    };

    const fetchFiles = async (id: string | undefined) => {
        if (!id) return;
        try {
            const response = await axios.get(`${API_URL}/files/${id}`);
            setFiles(response.data);
            setLoading(false);
        } catch (err) {
            showAlert("An Error Occurred!", 'Error fetching files', 'destructive');
        }
    };

    const handleDownloadFile = async (fileId: string | undefined, fileName: string | undefined) => {
        if (!fileId) return;
        try {
            const response = await axios.get(`${API_URL}/files/download/${fileId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(response.data);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `${fileName}`,
            );
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            setLoading(false);
            setTimeout(() => showAlert("File Downloaded!", "The file has been downloaded successfully", "success"), 1000)
        } catch (err) {
            showAlert("An Error Occurred!", 'Error fetching files', 'destructive');
        }
    }

    const handleDeleteFile = async (fileId: string | undefined) => {
        try {
            await axios.delete(`${API_URL}/files/delete/${fileId}`);
            setLoading(false);
            fetchFiles(course?.id);
            showAlert("Deleted!", 'Your file has been deleted', 'destructive');
        } catch (err) {
            showAlert("An Error Occurred!", 'Error deleting file', 'destructive');
        }
    };

    const handleDeleteEnrollmentOrSubject = async (id: string | undefined, type: string) => {
        let URLSegment = "";

        if (type == "USER") {
            URLSegment = "enrollments"
        } else if (type == "SUBJECT") {
            URLSegment = "subject-course"
        }

        try {
            await axios.delete(`${API_URL}/${URLSegment}`, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                },
                data: {
                    id: id,
                    courseId: course?.id
                }
            });

            if (type == "USER") {
                fetchUsers(course?.id, true);
            } else if (type == "SUBJECT") {
                fetchSubjectsByCourseId(course?.id, true);
            }
            setLoading(false);
            showAlert("Deleted!", `This ${type.toLowerCase()} has been deleted`, 'destructive');
        } catch (err) {
            showAlert("An Error Occurred!", `Error deleting ${type.toLowerCase()}`, 'destructive');
        }

    }

    return (
        <CourseContext.Provider value={{ course, setCourse, subjectsInCourse, subjectsNotInCourse, fetchSubjectsByCourseId, enrolledUsers, fetchUsers, notEnrolledUsers, loading, loadedFiles, fetchFiles, handleDownloadFile, handleDeleteEnrollmentOrSubject, handleDeleteFile }}>
            {children}
        </CourseContext.Provider>
    );
};
