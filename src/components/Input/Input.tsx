import React, { ReactNode} from 'react'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  img?: string;
}

const Input = ({onChange, img, children, ...props}: InputProps) => {

  return (
    <div className='inputContainer'>
      {img ? <img src={img} /> : ""}
      <input 
        className={`input ${props.className}`} 
        onChange={onChange}
        autoComplete="off" 
        {...props}
      />
      {children}
    </div>
  )
}

export default Input