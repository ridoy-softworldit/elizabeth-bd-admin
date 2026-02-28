type Props = {
  label?: string;
  options: string[];
  disabled?: boolean;
  defaultValue?: string;
};

export const Select = ({
  label,
  options,
  disabled = false,
  defaultValue,
}: Props) => (
  <div className="w-full">
    {label && <label className="block mb-1 opacity-85">{label}</label>}
    <select
      className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none"
      disabled={disabled}
      defaultValue={defaultValue}
    >
      <option value="">Please Select</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
