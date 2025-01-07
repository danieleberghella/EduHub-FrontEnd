export interface ITest {
    id: string;
    title: string;
    courseId: string;
    subjectId: string;
    availableMinutes: number;
    questions: IQuestion[];
}

export interface IQuestion {
    id: string;
    questionText: string;
    points: number;
    answers: IAnswer[];
}

export interface IAnswer {
    id: string;
    text: string;
    correctAnswer: boolean;
}