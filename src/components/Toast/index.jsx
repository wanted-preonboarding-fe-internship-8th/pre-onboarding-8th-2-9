import styled from 'styled-components';

export default function Toast({ ...props }) {
  return <ToastContainer status={props.status}>{props.message}</ToastContainer>;
}

const ToastContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 11px;
  min-width: 350px;
  transform: translate(-50%, -50%);
  z-index: 3;
  color: ${(props) => `var(--${props.status})`};
  background-color: ${(props) => `var(--${props.status}-bg)`};
  border-radius: 4px;
`;
