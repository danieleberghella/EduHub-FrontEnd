import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useCourse } from '@/contexts/CourseContext';
import { Plus } from 'lucide-react';
import { useAlert } from '@/contexts/AlertContext';

export const AddUserToCourseDialog = () => {
    const { showAlert } = useAlert();
    const { course, fetchUsers, notEnrolledUsers } = useCourse();
    const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});

    const handleToggleUser = (userId: string) => {
        setSelectedUsers((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const handleEnroll = async () => {
        const selectedUserIds = Object.keys(selectedUsers)
            .filter((userId) => selectedUsers[userId]);

        if (selectedUserIds.length === 0 || !course?.id) {
             showAlert("An Error Occurred!", "No users selected or course ID missing", 'destructive');
            return;
        }

        const payload = {
            userIds: selectedUserIds,
            courseId: course.id,
        };

        try {
            await axios.post('http://localhost:8000/enrollments', payload);
            fetchUsers(course.id, true);
            setSelectedUsers({});
            showAlert("Success!", "User added successfully", "success")
        } catch (error) {
            showAlert("An Error Occurred!", `Error enrolling users: ${error}`, 'destructive');
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="max-w-6" asChild>
                <Button variant={"ghost"} onClick={() => fetchUsers(course?.id, false)}><Plus /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-2xl font-bold'>Add Users to this course</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notEnrolledUsers ? notEnrolledUsers?.filter(u => u.role != "REGISTRATION").map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                            <Label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={!!selectedUsers[user.id]}
                                    onChange={() => handleToggleUser(user.id)}
                                    className="mr-2"
                                />
                                <p className='text-lg'>{user.lastName} {user.firstName} ({user.role})</p>
                            </Label>
                        </div>
                    )) : <p>There is no user available</p> }
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" onClick={handleEnroll}>Submit Enrollments</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserToCourseDialog;