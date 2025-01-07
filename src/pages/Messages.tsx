import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import IMessage from "@/interfaces/Message";
import { useAlert } from "@/contexts/AlertContext";

const API_URL = import.meta.env.VITE_API_URL;

export const Messages = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [filter, setFilter] = useState<"all" | "teachers" | "students" | "signup request">("all");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Record<string, "STUDENT" | "TEACHER">>({});

    useEffect(() => {
        if (user?.id) {
            fetchMessages(user.id);
        }
    }, [user]);

    const fetchMessages = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${API_URL}/messages/user/${userId}`);
            setMessages(data);
        } catch (err) {
            setError("Failed to fetch messages. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (senderId: string, newRole: "STUDENT" | "TEACHER") => {
        try {
            await axios.put(`${API_URL}/users/${senderId}`, {
                role: newRole,
            });
            showAlert("Success", "Role updated successfully!", "success");
            fetchMessages(user?.id || "");
        } catch (err) {
            showAlert("Error", "Failed to update role. Please try again.", "destructive");
        }
    };

    const sortedMessages = messages.sort((a, b) => {
        return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
    });

    const filteredMessages = sortedMessages.filter((msg) => {
        
        if (filter === "all") return true;
        if (filter === "teachers") return msg.senderRole === "TEACHER";
        if (filter === "students") return msg.senderRole === "STUDENT";
        if (filter === "signup request") return msg.senderRole === "REGISTRATION";
        return false;
    });

    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Teachers", value: "teachers" },
        { label: "Students", value: "students" },
        { label: "Signup Requests", value: "signup request" },
    ];

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>

            <div className="flex gap-4 mb-6">
                {filterOptions.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value as any)}
                        className={`px-4 py-2 rounded-lg ${filter === value ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-gray-500">Loading messages...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="rounded-lg shadow-md p-4 space-y-4">
                    {filteredMessages.length === 0 ? (
                        <p className="text-gray-500 bg-white p-4">No messages to display.</p>
                    ) : (
                        filteredMessages.map((msg) => (
                            <div key={msg.sentAt + msg.senderId} className="p-4 bg-gray-50 rounded-md shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">Subject: {msg.messageSubject}</span>
                                    <span className="text-sm text-gray-500">{new Date(msg.sentAt).toLocaleDateString()}</span>
                                </div>
                                <div className="text-gray-800 mb-2">
                                    <p>
                                        <span className="font-semibold">From:</span> {msg.senderName}
                                    </p>
                                    <p>
                                        <span className="font-semibold">To:</span> {msg.receiverName}
                                    </p>
                                </div>
                                {msg.senderRole === "REGISTRATION" && (
                                    <div className="mt-4">
                                        <label className="block font-semibold mb-2">Set Role:</label>
                                        <select
                                            value={selectedRoles[msg.senderId] || ""}
                                            onChange={(e) =>
                                                setSelectedRoles((prev) => ({
                                                    ...prev,
                                                    [msg.senderId]: e.target.value as "STUDENT" | "TEACHER",
                                                }))
                                            }
                                            className="p-2 border rounded"
                                        >
                                            <option value="" disabled>
                                                Select role
                                            </option>
                                            <option value="STUDENT">Student</option>
                                            <option value="TEACHER">Teacher</option>
                                        </select>
                                        <button
                                            onClick={() => updateRole(msg.senderId, selectedRoles[msg.senderId]!)}
                                            disabled={!selectedRoles[msg.senderId]}
                                            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                )}
                                <div className="mt-2">
                                    <span className="font-semibold">Content:</span>
                                    <p className="text-gray-700 line-clamp-3">{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
