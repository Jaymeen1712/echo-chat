import { LuAlertTriangle } from "react-icons/lu";

interface FormErrorProps {
  message?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-xl bg-red-600/15 p-3 text-sm text-red-600">
      <LuAlertTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
