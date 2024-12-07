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
    <div className="grid h-screen grid-cols-2 bg-white-primary p-2 text-black-primary">
      <div className="relative z-10 h-full overflow-hidden rounded-xl bg-black-primary">
        <div className="flex h-full w-full items-center justify-center">
          <div className="absolute left-16 top-16 flex items-center gap-x-8 uppercase tracking-[4px] text-white-primary">
            <span>a wise quote</span>
            <span className="h-0.5 w-32 bg-white-primary" />
          </div>
          <div className="absolute bottom-16 left-16 flex flex-col gap-y-4 text-white-primary">
            <div className="font-noto flex flex-col gap-y-3 text-7xl">
              <span>Welcome</span>
              <span>Back To Your</span>
              <span>World Of Chats</span>
            </div>
            <div className="mt-8 flex flex-col gap-y-2">
              <span>
                Every great conversation starts with 'Hello'—sign in to continue
                yours.
              </span>
              <span>Connection is just a click away.</span>
            </div>
          </div>
          <img
            src="/auth-container-background.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <AuthContainer
        title="Welcome back"
        description="Please enter your details to sign in"
        footer={
          <div className="flex items-center justify-center gap-x-2">
            <span className="text-sm opacity-50">Don't have an account?</span>
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
    </div>
  );
}

export default LoginPage;
