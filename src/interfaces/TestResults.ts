export interface ITestResults {
    [index: string]: any;
    id: string;
    testId: string;
    title: string;
    studentId: string;
    courseId: string;
    score: number;
    success: boolean;
    questions: IQuestionsResult;
    testDuration: number;
    questionScores: IQuestionScoresResults;
}

export interface IQuestionScoresResults {
    id: number;
}

export interface IQuestionsResult {
    id: string[];
}