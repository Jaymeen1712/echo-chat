interface FormErrorProps {
  message: string | undefined;
}

const FormItemError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="mt-2 rounded-xl text-xs text-red-600">{message}</div>;
};

export default FormItemError;
