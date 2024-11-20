import Button from "@/components/custom-button";
import { AxiosCustomErrorType } from "@/types";
import { AuthContainer, FormItem } from "../../../components";
import { FormError, FormInput, FormItemError } from "../../../components/form";
import SignUpController from "./sign-up-controller";

function SignUpPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    handleRedirectToLoginPage,
    errors,
    createUserMutation,
  } = SignUpController();

  return (
    <div className="relative grid h-screen grid-cols-2 p-4">
      <div />
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
            Submit
          </Button>
        </form>
      </AuthContainer>

      <div className="absolute">
        <img src="/wallhaven-ym1gpx.jpg" alt="Avatar" />
      </div>
    </div>
  );
}

export default SignUpPage;
