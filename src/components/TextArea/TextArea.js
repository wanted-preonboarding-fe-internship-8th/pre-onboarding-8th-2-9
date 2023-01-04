import styled from 'styled-components';

export default function TextArea({ ...props }) {
  const { name, id, placeHolder, value, onChange, onMouseOut } = props;
  return (
    <TextAreaContainer>
      <p className="title">내용</p>
      <textarea
        className="textarea"
        name={name}
        id={id}
        placeholder={placeHolder || '설명을 입력해주세요.'}
        value={value}
        onChange={onChange}
        onMouseOut={onMouseOut}
      />
    </TextAreaContainer>
  );
}

const TextAreaContainer = styled.div`
  margin: 15px 0;
  text-align: left;

  & .title {
    font-size: 14px;
  }

  & .textarea {
    width: 100%;
    height: 100px;
    margin-top: 5px;
    padding: 10px;
    background: var(--white);
    border: 1px solid var(--gray-400);
    border-radius: 10px;
    box-sizing: border-box;
    line-height: 1.5;
    resize: none;

    ::placeholder {
      color: var(--gray-400);
    }

    :focus {
      outline: none !important;
    }
  }
`;
