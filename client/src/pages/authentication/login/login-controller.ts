import { usePostLoginMutation } from "@/queries/user.query";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

interface IFormInput {
  email: string;
  password: string;
}

const useLoginController = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const postLoginMutation = usePostLoginMutation();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const { email, password } = data;

    postLoginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/all-chats");
        },
      },
    );
  };

  const handleRedirectToSignUpPage = async () => {
    navigate("/sign-up");
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    handleRedirectToSignUpPage,
    errors,
    postLoginMutation,
  };
};

export default useLoginController;
