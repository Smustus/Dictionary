import React, { ReactNode } from 'react'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
  validate?: (string: string) => string | null; 
  img?: string;
}

const Input = ({validate, onChange, img, children, ...props}: InputProps) => {
  //State to set the potential error, currently used to display if input is missing
  const [error, setError] = React.useState<string | null>(null);

  //Adds a blur event handler (when the input loses focus).If a validation function is provided, and if the validation fails, it sets an error message to be displayed.
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if(validate) {
      const errorMsg = validate(event.target.value);      
      setError(errorMsg);
    }
  };

  return (
    <>
    <div className='inputContainer'>
      {img ? <img src={img} /> : ""}
      <input 
        className={`input ${props.className}`} 
        onBlur={handleBlur} 
        onChange={onChange}
        autoComplete="off" 
        {...props}
      />
      {children}
    </div>
    {error && <p className='errorMsg' style={(error === 'Please enter a word to search') ? undefined : {color: 'red'}}>{error}</p>}
    </>
  )
}

export default Input