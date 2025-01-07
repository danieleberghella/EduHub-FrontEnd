import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useTest } from "@/contexts/TestContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import useFormPersist from "react-hook-form-persist";

const FormSchema = z.object({
  userId: z.string(),
  secondsLeft: z.number(),
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedAnswers: z.array(z.string().uuid()).min(1, "Choose at least 1 answer."),
      })
    )
});

type TakeTestFormValues = z.infer<typeof FormSchema>;

const TakeTest = () => {
  const { test, handleTestResults, setTestState } = useTest();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const availableMinutes = test?.availableMinutes ?? 20;
  const [timeLeft, setTimeLeft] = useState<number>(availableMinutes * 60);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);


  useEffect(() => {
    if (!test) {
      showAlert(
        "Loading...",
        "If it doesn't load, go back to the course page",
        "default",
        6000
      );
    } else {
      setIsLoading(false);
    }
  }, [test]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 0) {
          const newTime = prev - 1;
          formMethods.setValue("secondsLeft", newTime);
          return newTime;
        }
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.removeItem("take-test-form");

  }, [isSubmitted]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Loading...";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formMethods = useForm<TakeTestFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: user?.id || "",
      secondsLeft: timeLeft,
      answers:
        test?.questions.map((question) => ({
          questionId: question.id,
          selectedAnswers: [],
        })) || [],
    },
  });

  useFormPersist("take-test-form", {
    watch: formMethods.watch,
    setValue: formMethods.setValue,
    storage: window.localStorage,
  });

  const submitHandler: SubmitHandler<TakeTestFormValues> = async (data) => {
    try {
      const payload: Record<string, string[]> = {};
      data.answers.forEach(({ questionId, selectedAnswers }) => {
        payload[questionId] = selectedAnswers;
      });

      localStorage.setItem("test", JSON.stringify(test))
      setTestState(test);

      await handleTestResults(
        test?.id,
        payload,
        data.secondsLeft,
        data.userId
      );

      formMethods.reset({
        userId: user?.id || "",
        secondsLeft: 1200,
        answers:
          test?.questions.map((question) => ({
            questionId: question.id,
            selectedAnswers: [],
          })) || [],
      });

      setIsSubmitted(true);

    } catch (error) {
      showAlert(
        "Error!",
        "An error occurred while sending test results.",
        "destructive"
      );
    }
  };

  if (isLoading) {
    return;
  }

  return (
    <Form {...formMethods}>
      <div className=" m-auto max-w-7xl w-full p-8">
        <form id="take-test-form" onSubmit={formMethods.handleSubmit(submitHandler)} className="flex flex-col items-center max-w-7xl w-full gap-8">
          <div className="flex justify-between items-center w-full bg-white p-4">
            <Label className="text-2xl font-semibold">{test?.title}</Label>
            <div className="text-red-500 font-bold text-lg">
              Submit before: {formatTime(timeLeft)}
            </div>
          </div>

          {test?.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="p-4 bg-white rounded-md shadow-md space-y-4 w-full m-auto max-w-7xl"
            >
              <div className="flex justify-between items-center">
                <Label className="font-bold text-lg">
                  {questionIndex + 1 + ")"} {question.questionText}
                </Label>
                <div className="flex items-center gap-2">
                  <Label className="p-2 font-bold">Points:</Label>
                  <p className="px-2 font-bold">{question.points}</p>
                </div>
              </div>

              <div className="space-y-4">
                {question.answers.map((answer) => (
                  <FormField
                    key={answer.id}
                    control={formMethods.control}
                    name={`answers.${questionIndex}.selectedAnswers`}

                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              disabled={isSubmitted}
                              checked={field.value.includes(answer.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, answer.id]
                                  : field.value.filter((id) => id !== answer.id);
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <p className="w-full">{answer.text}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          ))}

          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-600 text-white px-6 py-2 rounded-md"
            disabled={isSubmitted}
          >
            Submit
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default TakeTest;
