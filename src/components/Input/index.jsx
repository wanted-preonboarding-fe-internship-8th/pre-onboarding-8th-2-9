import styled from 'styled-components';

export default function Input({ ...props }) {
  const { margin, type, value, placeholderText, onClick, onChange, name } =
    props;

  return (
    <InputContainer margin={margin}>
      <label htmlFor={name} className="label">
        {props.labelText}
      </label>
      <input
        className="input"
        id={name}
        type={type || 'text'}
        placeholder={placeholderText}
        onClick={onClick}
        onChange={onChange}
        value={value}
        name={name}
      />
    </InputContainer>
  );
}

const InputContainer = styled.div`
  margin: ${(props) => props.margin || '0 0 15px'};
  text-align: left;
  & .label {
    font-size: 14px;
  }
  & .input {
    font-size: 16px;
    width: 100%;
    margin-top: 5px;
    padding: 10px;
    background: var(--white);
    border: 1px solid var(--gray-400);
    border-radius: 10px;
    box-sizing: border-box;
    line-height: 1.5;
    text-overflow: ellipsis;

    ::placeholder {
      color: var(--gray-400);
    }
  }
`;
