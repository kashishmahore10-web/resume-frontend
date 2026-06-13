const InputField = ({
  type,
  name,
  placeholder,
  value,
  onChange
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border p-3 mb-4 rounded"
    />
  );
};

export default InputField;