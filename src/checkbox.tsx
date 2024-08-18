import { useEffect, useState } from "react"

export interface InputProp extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  setValue: (value: boolean) => void
}

export function Checkbox(inputProp: InputProp) {
  const { setValue: setValueProp, ...remainingProp } = inputProp

  const [value, setValue] = useState(() => Boolean(localStorage.getItem(inputProp.name)!))

  useEffect(() => {
    setValueProp(value)
    localStorage.setItem(inputProp.name, value ? "checked" : "")
  }, [value])

  return (
    <input
      {...remainingProp}
      type="checkbox"
      checked={Boolean(value)}
      onChange={(ev) => {
        setValue(ev.currentTarget.checked)
      }}
    />
  )
}
