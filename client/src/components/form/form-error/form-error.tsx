interface FormErrorProps {
  message: string | undefined;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  return <div className="mt-2 rounded-xl text-xs text-red-600">{message}</div>;
};

export default FormError;
