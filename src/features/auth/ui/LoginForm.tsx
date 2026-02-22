"use client"

import {z} from "zod";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {login} from "@/lib/api/auth";

const loginFormSchema = z.object({
  email: z.email("Введите корректный email"),
  password: z.string().min(6)
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = async (values: LoginFormValues) => {

    await login(values);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  return (
  <div className="flex items-center justify-center min-h-screen" >
    <Card className="w-full max-w-sm">

      <CardHeader>
        <CardTitle>Авторизация</CardTitle>
        <CardDescription>
          Пожалуйста введите логин и пароль для входа.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6">

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
              {errors.email &&
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Пароль</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
              {errors.password &&
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>}
            </div>

          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" form="login-form" disabled={isSubmitting} className="w-full">
          Войти
        </Button>
        <Button type="button" variant="outline" className="w-full">
          Регистрация
        </Button>
      </CardFooter>

    </Card>
  </div>
  );
}