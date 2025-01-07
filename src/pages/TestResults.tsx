import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { IQuestionScoresResults, IQuestionsResult } from "@/interfaces/TestResults";
import { Link } from "react-router-dom";


export const TestResults = () => {
    const { test, testResults } = useTest();
    const { userPath } = useAuth();

    if (!test || !testResults) {
        return <div>Loading...</div>;
    }

    const userAnswers: IQuestionsResult = testResults.questions;
    const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);
    const questionScores: IQuestionScoresResults = testResults.questionScores;
    const resultVariant = testResults.success && "text-green-500" || "text-red-500";

    return (
        <div className="flex flex-col items-center justify-center gap-4 m-auto max-w-6xl w-full p-8">
            <div className="flex flex-col w-full bg-white p-4 rounded-xl">
                <div className="flex justify-between items-center w-full">
                    <Label className="text-2xl font-semibold">{test.title}</Label>
                    <div className="text-xl font-semibold my-4 ">
                        <p>Score: <span className={resultVariant}>{testResults.score} / 30</span></p>
                    </div>
                    <div className="font-bold text-lg">
                        Time Taken: {Math.round((testResults.testDuration / 60) * 100) / 100} minutes
                    </div>
                </div>
                <div className="flex items-center justify-center w-full gap-4">
                    <span className="text-green-500">Correct answer</span>
                    <span className="text-red-500">Wrong answer</span>
                    <span className="text-yellow-400">Missed correct answers but no wrong answers</span>
                    <span className="text-red-300">Missed correct answer</span>
                </div>
            </div>
            {test.questions.map((question, questionIndex) => {
                const userQuestionAnswers = (userAnswers as any)[question.id] || [];
                const questionScore = (questionScores as any)[question.id] || 0;

                return (
                    <div
                        key={question.id}
                        className="p-4 bg-white rounded-xl shadow-md space-y-4 w-full m-auto max-w-7xl"
                    >
                        <div className="flex justify-between items-center">
                            <Label className="font-bold text-lg">
                                {questionIndex + 1}) {question.questionText}
                            </Label>
                            <div className="flex items-center gap-2">
                                <Label className="p-2 font-bold">Points:</Label>
                                <p className="px-2 font-bold">{Math.round(((question.points / totalPoints) * 30) * 100) / 100}</p>
                                <p
                                    className={`px-2 font-bold ${questionScore > 0 ? "text-green-500" : "text-red-500"}`}
                                >
                                    {Math.round(((questionScore / totalPoints) * 30) * 100) / 100}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {question.answers.map((answer) => {
                                const isCorrect = answer.correctAnswer;
                                const userSelected = userQuestionAnswers.includes(answer.id);
                                const isUserCorrect = userSelected === isCorrect;

                                let borderColor = "border-gray-300";
                                if (isUserCorrect && userSelected) {
                                    borderColor = "border-green-500";
                                } else if (!userSelected && isCorrect) {
                                    const hasOtherCorrectAnswers = question.answers.some(
                                        (a) => userQuestionAnswers.includes(a.id) && a.correctAnswer
                                    );
                                    const hasWrongAnswers = question.answers.some(
                                        (a) => userQuestionAnswers.includes(a.id) && !a.correctAnswer
                                    );

                                    if (hasWrongAnswers) {
                                        borderColor = "border-red-300";
                                    } else if (hasOtherCorrectAnswers) {
                                        borderColor = "border-yellow-500";
                                    } else {
                                        borderColor = "border-red-500";
                                    }
                                } else if (userSelected && !isCorrect) {
                                    borderColor = "border-red-500";
                                }

                                return (
                                    <div
                                        key={answer.id}
                                        className={`p-2 flex items-center gap-4 border-2 rounded-md ${borderColor}`}
                                    >
                                        <Checkbox
                                            checked={userSelected}
                                            disabled
                                        />
                                        <p>{answer.text}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            <Link to={`/${userPath}/courses/${testResults.title}`}>
                <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md m-auto"
                >
                    Back to Course Details
                </Button>
            </Link>
        </div>
    );
};

export default TestResults;