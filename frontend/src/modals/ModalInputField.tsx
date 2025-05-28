interface InputFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  disabled
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="input-base"
      />
    </div>
  )
}
