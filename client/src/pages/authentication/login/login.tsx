import Button from "@/components/custom-button";
import { AxiosCustomErrorType } from "@/types";
import { AuthContainer, FormItem } from "../../../components";
import { FormError, FormInput, FormItemError } from "../../../components/form";
import useLoginController from "./login-controller";

function LoginPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    handleRedirectToSignUpPage,
    errors,
    postLoginMutation,
  } = useLoginController();

  return (
    <div className="relative grid h-screen grid-cols-2 p-4">
      <div />
      <AuthContainer
        title="Welcome back"
        description="Please enter your details to sign in"
        footer={
          <div className="flex items-center justify-center gap-x-2">
            <span className="text-sm opacity-50">Already have an account?</span>
            <span
              className="cursor-pointer font-semibold"
              onClick={handleRedirectToSignUpPage}
            >
              Sign up
            </span>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <FormItem label={"Email"}>
            <FormInput
              {...register("email", {
                required: true,
                pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              })}
              placeholder="Enter email"
              isValidationError={!!errors?.email?.message}
            />
            <FormItemError message={errors?.email?.message} />
          </FormItem>
          <FormItem label={"Password"}>
            <FormInput
              {...register("password", { required: true })}
              type="password"
              placeholder="Enter password"
              isValidationError={!!errors?.password?.message}
            />
            <FormItemError message={errors?.password?.message} />
          </FormItem>

          {postLoginMutation.isError && (
            <FormError
              message={
                (postLoginMutation.error as AxiosCustomErrorType).response?.data
                  .message
              }
            />
          )}

          <Button
            type="submit"
            className="mt-4 w-full rounded-xl bg-purple-dark-1 px-4 py-3 text-white-primary transition-all hover:bg-opacity-95"
            isLoading={postLoginMutation.isLoading}
          >
            Sign in
          </Button>
        </form>
      </AuthContainer>

      <div className="fixed">
        <img
          src="/wallhaven-ym1gpx.jpg"
          alt="Avatar"
          className="-translate-y-12 transform object-cover"
        />
      </div>
    </div>
  );
}

export default LoginPage;
