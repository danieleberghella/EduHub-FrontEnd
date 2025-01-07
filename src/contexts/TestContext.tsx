import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import axios from "axios";
import ICourse from "@/interfaces/Course";
import { useAlert } from "./AlertContext";
import { ITest } from "@/interfaces/Test";
import { TestFormValues } from "@/pages/AddTest";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ITestResults } from "@/interfaces/TestResults";

const API_URL = import.meta.env.VITE_API_URL;

interface ITestContextProps {
    courses: ICourse[] | undefined;
    tests: ITest[] | undefined;
    test: ITest | undefined;
    testResults: ITestResults | undefined;
    testResultsByUserIdByCourseId: ITestResults[] | undefined;
    setTestState: (test: ITest | undefined) => void;
    setTestResults: (results: ITestResults | undefined) => void;
    fetchCourses: () => void;
    createTest: (testData: TestFormValues, courseName: string | undefined) => void;
    fetchTestsByCourseId: (courseId: string | undefined) => void;
    fetchTestsCompletedByUserIdByCourseId: (userId: string | undefined, courseId: string | undefined) => void;
    handleDeleteTest: (id: string, courseId: string | undefined) => void;
    handleTestResults: (id: string | undefined, testData: ITestResults[], secondsLeft: number, userId: string) => void;
    loading: boolean;
}

const TestContext = createContext<ITestContextProps | null>(null);

export const useTest = () => {
    const context = useContext(TestContext);
    if (!context) {
        throw new Error("useTest must be used inside TestProvider");
    }
    return context;
};

export const TestProvider = ({ children }: { children: ReactNode }) => {
    const { showAlert } = useAlert();
    const { userPath } = useAuth();
    const [courses, setCourses] = useState<ICourse[]>();
    const [tests, setTests] = useState<ITest[]>();
    const [test, setTestState] = useState<ITest | undefined>();
    const [testResults, setTestResultsState] = useState<ITestResults>();
    const [testResultsByUserIdByCourseId, setTestResultsByUserIdByCourseId] = useState<ITestResults[]>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const test: ITest = JSON.parse(localStorage.getItem('test') as string);
        if (test) {
            axios.get(`${API_URL}/tests/${test.id}`)
                .then(response => {
                    setTestState(response.data);
                    setLoading(false);
                })
                .catch(() => showAlert("An Error Occurred!", 'Error fetching test data', 'destructive'))
        }

        const savedTestResults = localStorage.getItem("testResults");
        if (savedTestResults) {
            setTestResultsState(JSON.parse(savedTestResults));
        }

        fetchCourses();
    }, []);

    const setTestResults = (results: ITestResults | undefined) => {
        setTestResultsState(results);
        localStorage.setItem("testResults", JSON.stringify(results));
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/courses`);
            setCourses(response.data);
        } catch (err) {
            showAlert("Error", "Failed to fetch courses", "destructive");
        } finally {
            setLoading(false);
        }
    };

    const fetchTestsByCourseId = async (courseId: string | undefined) => {
        try {
            if (courseId) {
                setLoading(true);
                const response = await axios.get(`${API_URL}/tests/course/${courseId}`);
                setTests(response.data);
            }
        } catch (err) {
            showAlert("Error", "Failed to fetch available tests", "destructive");
        } finally {
            setLoading(false);
        }
    };

    const createTest = async (testData: TestFormValues) => {
        try {
            setLoading(true);
            await axios.post(`${API_URL}/tests`, { ...testData });
            showAlert("Success", "Test created successfully", "success");
            setLoading(false);
            
            navigate(`/${userPath}/courses`)
        } catch (err) {
            showAlert("Error", "Failed to create the test", "destructive");
            setLoading(false);
            throw err;
        }
    };

    const handleDeleteTest = async (id: string | undefined, courseId: string | undefined) => {
        try {
            await axios.delete(`${API_URL}/tests/${id}`);
            setLoading(false);
            fetchTestsByCourseId(courseId);
            showAlert("Deleted!", 'Your test has been deleted', 'destructive');
        } catch (err) {
            showAlert("An Error Occurred!", 'Error deleting file', 'destructive');
        }
    };

    const handleTestResults = async (
        id: string | undefined,
        testData: ITestResults[],
        secondsLeft: number,
        userId: string
    ) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/tests/results/${id}`,
                { ...testData },
                {
                    params: {
                        secondsLeft,
                        userId,
                    },
                }
            );
            showAlert("Test submitted successfully!", "Check your results.", "success");
            setLoading(false);
            setTestResults(response.data);
            navigate(`/${userPath}/${test?.title}/results`);
        } catch (err) {
            showAlert("Error", "Failed to create the test", "destructive");
            setLoading(false);
        }
    };

    const fetchTestsCompletedByUserIdByCourseId = async (userId: string | undefined, courseId: string | undefined) => {

        try {
            if (courseId && userId) {
                setLoading(true);
                const response = await axios.get(`${API_URL}/tests/results/user/${userId}/course/${courseId}`);
                setLoading(false);
                setTestResultsByUserIdByCourseId(response.data);
            }
        } catch (err) {
            showAlert("Error", "Failed to fetch completed tests", "destructive");
            setLoading(false);
        }
    }


    return (
        <TestContext.Provider value={{
            courses,
            fetchCourses,
            loading,
            createTest,
            fetchTestsByCourseId,
            fetchTestsCompletedByUserIdByCourseId,
            testResultsByUserIdByCourseId,
            tests,
            handleDeleteTest,
            test,
            setTestState,
            testResults,
            setTestResults,
            handleTestResults
        }}>
            {children}
        </TestContext.Provider>
    );
};
