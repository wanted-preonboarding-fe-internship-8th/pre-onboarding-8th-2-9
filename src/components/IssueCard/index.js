import styled from 'styled-components';

import { managerList } from '../../temp';

export default function IssueCard({ ...props }) {
  const { title, manager, lastDate, onEdit, onMoveDetail } = props;

  return (
    <IssueCardContainer draggable>
      <p className="title">{title}</p>
      <p className="manager">{manager}</p>
      <p className="last-date">{lastDate}</p>
    </IssueCardContainer>
  );
}

const IssueCardContainer = styled.ul`
  padding: 10px;
  margin: 15px 0;
  border: 1px solid var(--gray-200);
  background-color: var(--white);
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 14px 0px rgba(174, 174, 174, 0.79);
  box-shadow: 0px 0px 14px 0px rgba(174, 174, 174, 0.79);

  & .title {
    font-size: 18px;
    margin-bottom: 6px;
  }

  & .manager {
    font-size: 14px;
    margin-bottom: 4px;
  }
  & .last-date {
    font-size: 12px;
    font-style: bold;
    color: var(--gray-400);
  }
`;
