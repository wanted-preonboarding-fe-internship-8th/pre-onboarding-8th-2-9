import styled from 'styled-components';

export default function Layout({ className = '', children }) {
  return <LayOutContainer className={className}>{children}</LayOutContainer>;
}

const LayOutContainer = styled.div`
  margin: 20px auto;
  padding: 20px;
  width: 830px;
  border-radius: 20px;
`;
