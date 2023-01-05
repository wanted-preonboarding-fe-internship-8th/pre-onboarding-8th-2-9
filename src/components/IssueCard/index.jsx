import { useState } from 'react';
import styled from 'styled-components';

import IssueModal from '../IssueModal';

export default function IssueCard({ ...props }) {
  const {
    title,
    manager,
    dueDate,
    groupId,
    issueItemId,
    dragging,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  } = props;

  return (
    <IssueCardContainer
      draggable
      onDragStart={(e) => handleDragStart(e, { groupId, issueItemId })}
      onDragEnter={
        dragging ? (e) => handleDragEnter(e, { groupId, issueItemId }) : null
      }
    >
      <p className="title">{title}</p>
      <p className="manager">{manager}</p>
      <p className="last-date">{dueDate}</p>
    </IssueCardContainer>
  );
}

const IssueCardContainer = styled.div`
  cursor: grab;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid var(--gray-200);
  background-color: var(--white);
  border-radius: 5px;
  -webkit-box-shadow: 0 0 14px 0 rgba(174, 174, 174, 0.79);
  box-shadow: 0 0 14px 0 rgba(174, 174, 174, 0.79);

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
