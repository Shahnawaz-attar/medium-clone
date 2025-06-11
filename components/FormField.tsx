import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

interface Props {
  label: string
  name: string
  register: UseFormRegister<any>
  required?: boolean
  type?: string
  placeholder?: string
  errors?: FieldErrors
  textarea?: boolean
  rows?: number
}

const FormField: React.FC<Props> = ({
  label,
  name,
  register,
  required = false,
  type = 'text',
  placeholder = '',
  errors,
  textarea = false,
  rows = 3,
}) => {
  const field = textarea ? (
    <textarea
      {...register(name, { required })}
      rows={rows}
      placeholder={placeholder}
      className='border px-3 py-2 rounded block w-full outline-none focus:shadow-md focus:ring-1'
    />
  ) : (
    <input
      {...register(name, { required })}
      type={type}
      placeholder={placeholder}
      className='border px-3 py-2 rounded block w-full outline-none focus:shadow-md focus:ring-1'
    />
  )

  return (
    <label className='block mb-5'>
      <span className='text-gray-700'>{label} :</span>
      {field}
      {errors && errors[name] && (
        <span className='text-red-500'>The {label} field is required</span>
      )}
    </label>
  )
}

export default FormField
