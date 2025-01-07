import { ITestResults } from "@/interfaces/TestResults";
import { useEffect, useState } from "react";

interface StudentStatisticsProps {
    testResults: ITestResults[]; // Assicurati che sia un array
}

const StudentStatistics = ({ testResults }: StudentStatisticsProps) => {
    const [averageScore, setAverageScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [minScore, setMinScore] = useState(0);
    const [averageDuration, setAverageDuration] = useState(0);

    useEffect(() => {
        if (Array.isArray(testResults) && testResults.length > 0) {
            const scores = testResults.map((result) => result.score);
            const durations = testResults.map((result) => result.testDuration);

            const totalScore = scores.reduce((a, b) => a + b, 0);
            setAverageScore(totalScore / scores.length);
            setMaxScore(Math.max(...scores));
            setMinScore(Math.min(...scores));

            const totalDuration = durations.reduce((a, b) => a + b, 0);
            setAverageDuration(totalDuration / durations.length);
            console.log(testResults);
            
        }
    }, [testResults]);

    if (!Array.isArray(testResults) || testResults.length === 0) {
        return <p>No test results available.</p>;
    }

    return (
        <div className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-md max-w-4xl">
            <h2 className="text-2xl font-bold">Personal Statistics</h2>
            <div className="flex flex-col gap-2">
                <p>
                    <strong>Average Score:</strong>{" "}
                    <span className={averageScore > 18 ? "text-green-500" : "text-red-500"}>
                        {averageScore.toFixed(2)} / 30
                    </span>
                </p>
                <p>
                    <strong>Highest Score:</strong> {maxScore} / 30
                </p>
                <p>
                    <strong>Lowest Score:</strong> {minScore} / 30
                </p>
                <p>
                    <strong>Average Time Taken:</strong> {averageDuration.toFixed(2)} minutes
                </p>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-xl font-bold">Test Breakdown</h3>
                {testResults.map((result) => (
                    <div key={result.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <span>
                            {result.title} ({result.score.toFixed(2)} / 30)
                        </span>
                        <span className={result.success ? "text-green-500" : "text-red-500"}>
                            {result.success ? "Passed" : "Failed"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentStatistics;
