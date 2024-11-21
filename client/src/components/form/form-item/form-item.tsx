interface FormItemProps {
  label: string;
  children: React.ReactNode;
}

const FormItem: React.FC<FormItemProps> = ({ children, label }) => {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      {children}
    </div>
  );
};

export default FormItem;
