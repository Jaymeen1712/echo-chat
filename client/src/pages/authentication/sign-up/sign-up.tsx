import Button from "@/components/custom-button";
import { AxiosCustomErrorType } from "@/types";
import { AuthContainer, FormItem } from "../../../components";
import { FormError, FormInput, FormItemError } from "../../../components/form";
import useSignUpController from "./sign-up-controller";

function SignUpPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    handleRedirectToLoginPage,
    errors,
    createUserMutation,
  } = useSignUpController();

  return (
    <div className="relative grid h-screen grid-cols-2 bg-white-primary p-2 text-black-primary">
      <div className="relative z-10 h-full overflow-hidden rounded-xl bg-black-primary">
        <div className="flex h-full w-full items-center justify-center">
          <div className="absolute left-16 top-16 flex items-center gap-x-8 uppercase tracking-[4px] text-white-primary">
            <span>a wise quote</span>
            <span className="h-0.5 w-32 bg-white-primary" />
          </div>
          <div className="absolute bottom-16 left-16 flex flex-col gap-y-4 text-white-primary">
            <div className="font-noto flex flex-col gap-y-3 text-7xl">
              <span>A World</span>
              <span>Of Connection</span>
              <span>Starts Here</span>
            </div>
            <div className="mt-8 flex flex-col gap-y-2">
              <span>
                Join the community where conversations create memories.
              </span>
              <span>Every relationship begins with a simple sign-up.</span>
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
        title="Create an account"
        description="Create your first account"
        footer={
          <div className="flex items-center justify-center gap-x-2">
            <span className="text-sm opacity-50">Already have an account?</span>
            <span
              className="cursor-pointer font-semibold"
              onClick={handleRedirectToLoginPage}
            >
              Login
            </span>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <FormItem label={"First Name"}>
            <FormInput
              {...register("firstName", { required: true })}
              placeholder="Enter first name"
              isValidationError={!!errors?.firstName?.message}
            />
            <FormItemError message={errors?.firstName?.message} />
          </FormItem>
          <FormItem label={"Last Name"}>
            <FormInput
              {...register("lastName", { required: true })}
              placeholder="Enter last name"
              isValidationError={!!errors?.lastName?.message}
            />
            <FormItemError message={errors?.lastName?.message} />
          </FormItem>
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

          {createUserMutation.isError && (
            <FormError
              message={
                (createUserMutation.error as AxiosCustomErrorType).response
                  ?.data.message
              }
            />
          )}

          <Button
            type="submit"
            className="mt-4 w-full rounded-xl bg-purple-dark-1 px-4 py-3 text-white-primary transition-all hover:bg-opacity-95"
            isLoading={createUserMutation.isLoading}
          >
            Sign up
          </Button>
        </form>
      </AuthContainer>
    </div>
  );
}

export default SignUpPage;
