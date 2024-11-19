import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters long"),

  lastName: yup
    .string()
    .required("Last name is required")
    .min(3, "Last name must be at least 3 characters long"),

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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpController = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  const handleRedirectToLoginPage = async () => {
    navigate("/login");
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    handleRedirectToLoginPage,
    errors,
  };
};

export default SignUpController;
