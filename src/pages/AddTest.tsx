import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useAlert } from "@/contexts/AlertContext";
import { useCourse } from "@/contexts/CourseContext";

const testSchema = z.object({
  title: z.string().nonempty("Please choose a title for this test").max(60, "Title must be at most 60 characters"),
  courseId: z.string().nonempty("Please select a course"),
  subjectId: z.string().nonempty("Please select a subject"),
  availableMinutes: z.number().min(20, "Available minutes must be at least 20").refine((val) => typeof val === "number", "Minutes value must be a valid number"),
  questions: z
    .array(
      z.object({
        questionText: z.string().max(400, "Question must be at most 400 characters").nonempty("Question text is required"),
        points: z.preprocess(
          (val) => {
            const parsed = parseInt(val as string, 10);
            return isNaN(parsed) ? undefined : parsed;
          },
          z.number()
            .min(1, "Points must be at least 1")
            .refine((val) => typeof val === "number", "Points must be a valid number")
        ),
        answers: z
          .array(
            z.object({
              id: z.string(),
              text: z.string().max(100, "Answer must be at most 100 characters").nonempty("Answer text is required"),
              correctAnswer: z.boolean(),
            })
          )
          .min(3, "Each question must have at least 3 answers")
          .max(4, "Each question can have at most 4 answers")
          .refine((answers) => answers.filter((a) => a.correctAnswer).length > 0, "At least one answer must be correct"),
      })
    )
    .min(1, "Add at least one question")
    .max(20, "Each test can have at most 20 questions"),
});

export type TestFormValues = z.infer<typeof testSchema>;

const AddTest = () => {
  const { courses, createTest } = useTest();
  const { subjectsInCourse, fetchSubjectsByCourseId } = useCourse();
  const { showAlert } = useAlert();
  const [questions, setQuestions] = useState<TestFormValues["questions"]>([
    { questionText: "", points: 1, answers: [{ id: uuidv4(), text: "", correctAnswer: false }] },
  ]);

  const {
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    mode: "onChange",
    defaultValues: {
      courseId: "",
      subjectId: "",
      questions,
    },
  });

  const updateQuestions = (updater: (questions: TestFormValues["questions"]) => TestFormValues["questions"]) => {
    const updatedQuestions = updater(getValues("questions"));
    setQuestions(updatedQuestions);
    setValue("questions", updatedQuestions);
  };

  const handleAddQuestion = () => {
    updateQuestions((currentQuestions) => {
      if (currentQuestions.length >= 20) {
        showAlert("Wait!", "You cannot add more than 20 questions", "destructive");
        return currentQuestions;
      }
      return [...currentQuestions, { questionText: "", points: 1, answers: [{ id: uuidv4(), text: "", correctAnswer: false }] }];
    });
  };

  const handleAddAnswer = (questionIndex: number) => {
    updateQuestions((currentQuestions) => {
      if (currentQuestions[questionIndex].answers.length >= 4) {
        showAlert("Wait!", "You cannot add more than 4 answers to a question", "destructive");
        return currentQuestions;
      }
      return currentQuestions.map((q, i) =>
        i === questionIndex
          ? { ...q, answers: [...q.answers, { id: uuidv4(), text: "", correctAnswer: false }] }
          : q
      );
    });
  };

  const handleRemoveQuestion = (questionIndex: number) => {
    updateQuestions((currentQuestions) => currentQuestions.filter((_, i) => i !== questionIndex));
  };

  const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
    updateQuestions((currentQuestions) =>
      currentQuestions.map((q, i) =>
        i === questionIndex
          ? { ...q, answers: q.answers.filter((_, j) => j !== answerIndex) }
          : q
      )
    );
  };

  const handleFieldChange = (
    questionIndex: number,
    field: keyof TestFormValues["questions"][number],
    value: any
  ) => {
    updateQuestions((currentQuestions) =>
      currentQuestions.map((q, i) => (i === questionIndex ? { ...q, [field]: value } : q))
    );
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    field: keyof TestFormValues["questions"][number]["answers"][number],
    value: any
  ) => {
    updateQuestions((currentQuestions) =>
      currentQuestions.map((q, i) =>
        i === questionIndex
          ? {
            ...q,
            answers: q.answers.map((a, j) => (j === answerIndex ? { ...a, [field]: value } : a)),
          }
          : q
      )
    );
  };

  const handleCourseChange = (courseId: string) => {
    setValue("courseId", courseId);
    clearErrors("courseId");
    fetchSubjectsByCourseId(courseId, true);
  };

  const handleSubjectChange = (subjectId: string) => {
    setValue("subjectId", subjectId);
    clearErrors("subjectId");
  };

  const handleMinutesChange = (minutes: number) => {
    setValue("availableMinutes", minutes);
    clearErrors("availableMinutes");
  };

  const handleTitleChange = (title: string) => {
    setValue("title", title);
    clearErrors("title");
  };

  const submitHandler: SubmitHandler<TestFormValues> = (data) => { createTest(data, courses?.find(c => c.id === data.courseId)?.name) };

  return (
    <div className="p-6 bg-transparent rounded-md mx-16 my-8">
      <form
        className="space-y-6 flex flex-col justify-center items-center"
        onSubmit={(e) => {
          e.preventDefault();
          setValue("questions", questions);
          handleSubmit(submitHandler)();
        }}
      >
        <div className="p-4 bg-gray-200 rounded-xl shadow-md space-y-4 min-w-96 max-w-lg">
          <h2 className="text-lg font-semibold">Course and Subject</h2>
          <div className="w-full">
            <Label>Select Course</Label>
            <Select onValueChange={handleCourseChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Courses</SelectLabel>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {isSubmitted && errors.courseId && <p className="text-red-500 text-xs">{errors.courseId.message}</p>}
          </div>
          <div className="w-full">
            <Label>Select Subject</Label>
            <Select onValueChange={handleSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Subjects</SelectLabel>
                  {subjectsInCourse?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {isSubmitted && errors.subjectId && <p className="text-red-500 text-xs">{errors.subjectId.message}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center mr-3 gap-2 p-4 bg-gray-200 rounded-xl">
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-2 items-center">
              <Label className="p-2 text-2xl">Title</Label>
              <Input type="text" placeholder={`Test Title`}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            {isSubmitted && errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-2 items-center">
              <Label className="p-2">Available Minutes</Label>
              <Input
                className="max-w-20"
                type="number"
                onChange={(e) => handleMinutesChange(Number(e.target.value))}
              />
            </div>
            {isSubmitted && errors.availableMinutes && <p className="text-red-500 text-xs">{errors.availableMinutes.message}</p>}
          </div>
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="p-4 bg-gray-200 rounded-xl shadow-md space-y-4 w-full m-auto max-w-7xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Label className="p-2 min-w-24 font-bold text-lg">Question {questionIndex + 1}</Label>
                <Trash2 className="text-red-500 cursor-pointer" onClick={() => handleRemoveQuestion(questionIndex)} />
              </div>
              <div className="flex items-center mr-3 gap-2">
                <Label className="p-2">Points</Label>
                <Input
                  className="max-w-20"
                  type="number"
                  value={question.points}
                  onChange={(e) => handleFieldChange(questionIndex, "points", Number(e.target.value))}
                />
                {isSubmitted && errors.questions?.[questionIndex]?.points && (
                  <p className="text-red-500 text-xs">{errors.questions[questionIndex].points?.message}</p>
                )}
              </div>
            </div>
            <Textarea
              value={question.questionText}
              onChange={(e) => handleFieldChange(questionIndex, "questionText", e.target.value)}
              placeholder="Question text"
            />
            {isSubmitted && errors.questions?.[questionIndex]?.questionText && (
              <p className="text-red-500 text-xs">{errors.questions[questionIndex].questionText?.message}</p>
            )}
            <div className="space-y-4">
              {question.answers.map((answer, answerIndex) => (
                <div key={answer.id} className="flex items-center gap-4">
                  <Checkbox
                    checked={answer.correctAnswer}
                    onCheckedChange={(value) => handleAnswerChange(questionIndex, answerIndex, "correctAnswer", value)}
                  />
                  <Input
                    className="w-full"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(questionIndex, answerIndex, "text", e.target.value)}
                    placeholder={`Answer ${answerIndex + 1}`}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}
                  />
                  {isSubmitted && errors.questions?.[questionIndex]?.answers?.[answerIndex]?.text && (
                    <p className="text-red-500 text-xs">{errors.questions[questionIndex].answers[answerIndex]?.text?.message}</p>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between">
                <Button type="button" onClick={() => handleAddAnswer(questionIndex)}>
                  Add Answer
                </Button>
                <div className="flex gap-2">
                  {isSubmitted && errors.questions?.[questionIndex]?.answers && (
                    <div className="flex items-center gap-4">
                      <span className="text-xs">Errors:</span>
                      {question.answers.length < 3 && (
                        <p className="text-red-500 text-xs">Each question must have at least 3 answers.</p>
                      )}
                      {!question.answers.some((a) => a.correctAnswer) && (
                        <p className="text-red-500 text-xs">At least one answer must be correct.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex w-full items-center justify-between p-4 max-w-7xl">
          <Button type="button" onClick={handleAddQuestion}>
            Add Question
          </Button>
          <Button type="submit" variant="default" className="bg-green-500 hover:bg-green-500" disabled={isSubmitting}>
            Submit Test
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTest;