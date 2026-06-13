const Button = ({
  text,
  onClick,
  className
}) => {

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded text-white ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;