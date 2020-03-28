import React from "react";
import styled from "styled-components";

const InputYinput = styled.input`
  font-size: 14px;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-clip: padding-box;

  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;

  &.input_success {
    :focus {
      border-color: #28a745;
      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
  }
  &.input_error {
    border-color: #dc3545;
    :focus {
      border-color: #28a745;
      box-shadow: 0 0 0 0.2rem rgba(232, 43, 43, 0.3);
    }
  }
`;

const Input = ({
  className,
  type,
  name,
  value,
  onChange,
  disabled,
  style,
  errors
}) => {
  return (
    <InputYinput
      disabled={disabled}
      className={[...className, errors[name] ? "input_error" : "input_success"]}
      type={type}
      value={value}
      onChange={event => onChange(name, event.currentTarget.value)}
      style={{ ...style }}
    />
  );
};

export default Input;
