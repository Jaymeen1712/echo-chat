interface AuthContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: string | React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  description,
  children,
  footer,
}) => {
  return (
    <div className="z-10 flex h-full flex-col p-8">
      <div className="text-center">Logo</div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="font-noto text-center text-5xl font-extrabold text-purple-dark-1">
          {title}
        </h1>
        <span className="pt-3 text-sm opacity-50">{description}</span>
        <div className="py-12">{children}</div>
      </div>
      {footer}
    </div>
  );
};

export default AuthContainer;
