import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useCourse } from '@/contexts/CourseContext';
import { Plus } from 'lucide-react';
import { useAlert } from '@/contexts/AlertContext';

export const AddSubjectToCourseDialog = () => {
    const { showAlert } = useAlert();
    const { course, fetchSubjectsByCourseId, subjectsNotInCourse } = useCourse();
    const [selectedSubjects, setSelectedSubjects] = useState<{ [key: string]: boolean }>({});

    const handleToggleSubject = (subjectId: string) => {
        setSelectedSubjects((prev) => ({
            ...prev,
            [subjectId]: !prev[subjectId],
        }));
    };

    const handleAddSubjects = async () => {
        const selectedSubjectIds = Object.keys(selectedSubjects)
            .filter((subjectId) => selectedSubjects[subjectId]);

        if (selectedSubjectIds.length === 0 || !course?.id) {
            showAlert("An Error Occurred!", "No subjects selected or course ID missing", 'destructive');
            return;
        }

        const payload = {
            subjectIds: selectedSubjectIds,
            courseId: course.id,
        };

        try {
            await axios.post('http://localhost:8000/subject-course', payload);
            fetchSubjectsByCourseId(course.id, true);
            setSelectedSubjects({});
            showAlert("Success!", "Subject added successfully", "success")
        } catch (error) {
            showAlert("An Error Occurred!", `Error adding subjects to course: ${error}`, 'destructive');
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="max-w-6" asChild>
                <Button variant={"ghost"} onClick={() => fetchSubjectsByCourseId(course?.id, false)}><Plus /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-2xl font-bold'>Add Subjects to this course</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {subjectsNotInCourse?.map((subject) => (
                        <div key={subject.id} className="flex items-center justify-between">
                            <Label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={!!selectedSubjects[subject.id]}
                                    onChange={() => handleToggleSubject(subject.id)}
                                    className="mr-2"
                                />
                                <p className='text-lg'>{subject.name}</p>
                            </Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" onClick={handleAddSubjects}>Submit Subjects</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddSubjectToCourseDialog;
