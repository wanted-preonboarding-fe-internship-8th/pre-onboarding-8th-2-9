import styled from 'styled-components';

const Loader = () => {
  return (
    <LoaderContainer>
      <div className="spinner"></div>
    </LoaderContainer>
  );
};

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--white);
  & .spinner {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 50px;
    width: 50px;
    margin: -25px 0 0 -25px;
    border: 2px solid transparent;
    border-top-color: var(--gray3);
    border-radius: 50%;
    -webkit-animation: spin7 1.5s ease infinite;
    animation: spin7 1.5s ease infinite;
    &::before {
      content: '';
      position: absolute;
      top: 7px;
      right: 7px;
      bottom: 7px;
      left: 7px;
      border: 2px solid transparent;
      border-radius: 50%;
      border-top-color: var(--gray3);
      -webkit-animation: spin7 3s linear infinite;
      animation: spin7 3s linear infinite;
    }

    &::after {
      content: '';
      position: absolute;
      top: 15px;
      right: 15px;
      bottom: 15px;
      left: 15px;
      border: 2px solid transparent;
      border-radius: 50%;
      border-top-color: var(--gray3);
      -webkit-animation: spin7 1.5s ease infinite;
      animation: spin7 1.5s ease infinite;
    }

    @-webkit-keyframes spin7 {
      from {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
      }
    }
    @keyframes spin7 {
      from {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
      }
    }
  }
`;

export default Loader;
