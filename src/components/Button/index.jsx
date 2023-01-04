import React from 'react';
import styled from 'styled-components';

export default function Button({
  text,
  className = '',
  width = '100%',
  height = '45px',
  margin = '10px 0 0 0',
  background = 'var(--gray-400)',
  color = 'var(--white)',
  disabled = false,
  onClick,
}) {
  return (
    <StyledButton
      className={className}
      onClick={onClick}
      disabled={disabled}
      width={width}
      height={height}
      margin={margin}
      background={background}
      color={color}
    >
      {text}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  width: ${(props) => props.width};
  padding: 10px;
  margin: ${(props) => props.margin};
  border-radius: 10px;
  background: ${(props) => props.background};
  outline: none;
  color: ${(props) => props.color};
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
`;
