import { useEffect, useState } from "react"

export interface InputProp extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  setValue: (value: string) => void
}

export function Input(inputProp: InputProp) {
  const { setValue: setValueProp, ...remainingProp } = inputProp

  const [value, setValue] = useState(() => localStorage.getItem(inputProp.name)!)

  useEffect(() => {
    setValueProp(value)
    localStorage.setItem(inputProp.name, value)
  }, [value])

  return (
    <input
      {...remainingProp}
      value={String(value)}
      onChange={(ev) => {
        setValue(ev.currentTarget.value)
      }}
    />
  )
}
