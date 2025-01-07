import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useCourse } from "@/contexts/CourseContext";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "./ui/input";
import { useAlert } from "@/contexts/AlertContext";

const API_URL = import.meta.env.VITE_API_URL;

export const AddFileToCourseDialog = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const { course, fetchFiles } = useCourse();
    const [file, setFile] = useState<File| null>(null);
    const [uploading, setUploading] = useState(false);

    const getFileImagePreview = () => URL.createObjectURL(file as Blob) ?? "";

    const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = e; 
        if (files?.length) {
            setFile(files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!file || !course?.id) {
            showAlert("An error Occurred", "No file selected or course ID is missing", 'destructive');
            return;
        }

        const formData = new FormData();
        if (user?.id) {
            formData.append("files", file);
            formData.append("course-id", course.id);
            formData.append("teacher-id", user.id);
        } else {
            showAlert("An error occurred", "Teacher ID is missing", 'destructive');
            return;
        }

        setUploading(true);
        try {
            await axios.post(`${API_URL}/files/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchFiles(course.id);
            setFile(null);
            showAlert("Success!", "Files uploaded successfully", "success")
        } catch (error) {
            showAlert(`Error! `, `An error occurred while uploading files`, 'destructive');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" onClick={() => fetchFiles(course?.id)}><Plus /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Upload Files</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <Label className="block text-lg font-semibold">Choose your file</Label>
                    <Input
                        type="file"
                        className="block w-full"
                        onChange={handleInputFileChange}
                    />
                    {file && <img src={getFileImagePreview()} />}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" onClick={handleFileUpload} disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload File"}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default AddFileToCourseDialog;
