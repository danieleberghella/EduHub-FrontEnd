import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useCourse } from '@/contexts/CourseContext';
import { Button } from '../components/ui/button';
import { ClipboardPen, Dot, FileDown, FileSearch, Pencil, PenOff, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddUserToCourseDialog from '../components/AddUserToCourseDialog';
import AddSubjectToCourseDialog from '../components/AddSubjectToCourseDialog';
import AddFileToCourseDialog from '../components/AddFileToCourseDialog';
import { useTest } from '@/contexts/TestContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ITest } from '@/interfaces/Test';
import { ITestResults } from '@/interfaces/TestResults';
import StudentStatistics from '@/components/StudentStatistics';

export const CourseDetails = () => {
    const { tests, handleDeleteTest, fetchTestsByCourseId, setTestState, fetchTestsCompletedByUserIdByCourseId, testResultsByUserIdByCourseId, setTestResults } = useTest();
    const { userPath, user } = useAuth();
    const { course, subjectsInCourse, fetchSubjectsByCourseId, enrolledUsers, fetchUsers, loadedFiles, fetchFiles, handleDownloadFile, handleDeleteEnrollmentOrSubject, handleDeleteFile } = useCourse();
    const [subjectsEdit, setSubjectsEdit] = useState(false);
    const [usersEdit, setUsersEdit] = useState(false);
    const [filesEdit, setFilesEdit] = useState(false);
    const [testsEdit, setTestsEdit] = useState(false);
    const readonly = user?.role === "STUDENT";
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubjectsByCourseId(course?.id, true);
        fetchUsers(course?.id, true);
        fetchFiles(course?.id);
        fetchTestsByCourseId(course?.id);
        fetchTestsCompletedByUserIdByCourseId(user?.id, course?.id);
    }, [course]);


    const handleSetTest = (test: ITest | undefined) => {
        localStorage.setItem("test", JSON.stringify(test))
        setTestState(test);
    }

    const handleSetTestResult = (testResult: ITestResults) => {
        localStorage.setItem("testResult", JSON.stringify(testResult))
        const testToCheck = tests?.find(t => t.id === testResult.testId)
        handleSetTest(testToCheck);
        setTestResults(testResult);
        if (testResult) {
            setTimeout(() => {
                navigate(`/${userPath}/${testResult?.title}/results`);
            }, 100);
        }
    }

    return (
        <div className="flex flex-col w-full">
            <div className='flex flex-col lg:flex-row w-full m-auto'>
                <div className='grid grid-cols-1 p-4 space-y-4 w-full max-w-3xl'>
                    <Card>
                        <CardHeader>
                            <CardTitle>{course?.name}</CardTitle>
                            <CardDescription className='pt-4'>{course?.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Total Hours: {course?.totalHours}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='flex flex-row justify-start items-center gap-2'>
                            <CardTitle className='text-lg'>Subjects</CardTitle>
                            {!readonly && <>
                                <AddSubjectToCourseDialog />
                                <Button variant={'ghost'} onClick={() => setSubjectsEdit(!subjectsEdit)}>
                                    {subjectsEdit && <PenOff /> || <Pencil />}
                                </Button>
                            </>}
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {subjectsInCourse?.map((subject) => (
                                    <div key={subject.id} className='flex items-center gap-2'>
                                        <Dot />
                                        {subject.name}
                                        {subjectsEdit ?
                                            <Trash2 onClick={() => handleDeleteEnrollmentOrSubject(subject.id, "SUBJECT")} className='size-4 cursor-pointer text-red-500' />
                                            :
                                            ""}
                                    </div>
                                ))}
                                {subjectsInCourse?.length == 0 &&
                                    <p className='text-xl font-bold'>This list is empty</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='flex flex-row justify-start items-center gap-2'>
                            <CardTitle className='text-lg'>Enrolled Users</CardTitle>
                            {!readonly && <>
                                <AddUserToCourseDialog />
                                <Button variant={'ghost'} onClick={() => setUsersEdit(!usersEdit)}>
                                    {usersEdit && <PenOff /> || <Pencil />}
                                </Button>
                            </>}
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {enrolledUsers?.sort((a, b) => {
                                    if (a.role === b.role) {
                                        return a.id.localeCompare(b.id);
                                    }
                                    return a.role === 'TEACHER' ? -1 : 1;
                                }).map((user) => (
                                    <div key={user.id} className={cn("flex items-center gap-2", user.role === 'TEACHER' ? 'font-bold' : '')}>
                                        <Dot />
                                        <p>{user.lastName} {user.firstName} ({user.role})</p>
                                        {usersEdit ?
                                            <Trash2 onClick={() => handleDeleteEnrollmentOrSubject(user.id, "USER")} className='size-4 cursor-pointer text-red-500' />
                                            :
                                            ""}
                                    </div>
                                ))}
                                {enrolledUsers?.length == 0 &&
                                    <p className='text-xl font-bold'>This list is empty</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='grid grid-cols-1 p-4 space-y-4 w-full max-w-3xl'>
                    <Card>
                        <CardHeader className='flex flex-row justify-start items-center gap-2'>
                            <CardTitle className='text-lg'>Educational Materials</CardTitle>
                            {!readonly && <>
                                <AddFileToCourseDialog />
                                <Button variant={'ghost'} onClick={() => setFilesEdit(!filesEdit)}>
                                    {filesEdit && <PenOff /> || <Pencil />}
                                </Button>
                            </>}
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {loadedFiles?.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                                    .map((file) => (
                                        <div key={file.id} className='flex font-bold  items-center gap-2'>
                                            <Dot />
                                            {file.fileName} {file.teacherLastName} ({file.uploadDate})
                                            {filesEdit ?
                                                <Trash2 onClick={() => handleDeleteFile(file.id)} className='size-4 cursor-pointer text-red-500' />
                                                :
                                                <FileDown onClick={() => handleDownloadFile(file.id, file.fileName)} className='cursor-pointer text-blue-600' />}
                                        </div>
                                    ))}
                                {loadedFiles?.length == 0 &&
                                    <p className='text-xl font-bold'>This list is empty</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='flex flex-row justify-start items-center gap-2'>
                            <CardTitle className='text-lg'>Available Tests</CardTitle>
                            {!readonly && <>
                                <Link to={`/${userPath}/add-test`}><Button variant="ghost"><Plus /></Button></Link>
                                <Button variant={'ghost'} onClick={() => setTestsEdit(!testsEdit)}>
                                    {testsEdit && <PenOff /> || <Pencil />}
                                </Button>
                            </>}
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {tests?.map((test) => (
                                    <div key={test.id} className='flex font-bold  items-center gap-2'>
                                        <Dot />
                                        {test.title} ({subjectsInCourse?.find(subject => subject.id === test.subjectId)?.name || "Subject name not found"}, {test.availableMinutes} min)
                                        {testsEdit ?
                                            <Trash2 onClick={() => handleDeleteTest(test.id, course?.id)} className='size-4 cursor-pointer text-red-500' />
                                            :
                                            <Link to={`/${userPath}/${test.title}`} onClick={() => handleSetTest(test)}><ClipboardPen className='cursor-pointer text-blue-600' /></Link>}
                                    </div>
                                ))}
                                {tests?.length == 0 &&
                                    <p className='text-xl font-bold'>This list is empty</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {user?.role === "STUDENT" &&
                <div className='flex flex-col lg:flex-row w-full m-auto'>
                    <div className='grid grid-cols-1 p-4 w-full max-w-3xl'>
                        <Card className='p-4'>
                            <CardHeader className='flex flex-row justify-start items-center gap-2'>
                                <CardTitle className='text-lg'>Tests completed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {testResultsByUserIdByCourseId?.map((testResult) => (
                                        <div key={testResult.id} className='flex font-bold  items-center gap-2'>
                                            <Dot />
                                            <span>{testResult.title} (<span className={testResult.score > 18 ? "text-green-500" : "text-red-500"}>{testResult.score} </span>/ 30)</span>
                                            <FileSearch className='cursor-pointer text-blue-600' onClick={() => handleSetTestResult(testResult)} />
                                        </div>
                                    ))}
                                    {tests?.length == 0 &&
                                        <p className='text-xl font-bold'>This list is empty</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                    <div className='grid grid-cols-1 p-4 w-full max-w-3xl'>
                        <Card className='p-4'>
                            <CardHeader className='flex flex-row justify-start items-center gap-2'>
                                <CardTitle className='text-lg'>Tests Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {Array.isArray(testResultsByUserIdByCourseId) &&

                                        <StudentStatistics testResults={testResultsByUserIdByCourseId} />
                                    }
                                    {tests?.length == 0 &&
                                        <p className='text-xl font-bold'>This list is empty</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>}

        </div >
    )
};
