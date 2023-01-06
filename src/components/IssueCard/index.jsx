import { useState } from 'react';
import styled from 'styled-components';

import IssueModal from '../IssueModal';

export default function IssueCard({ ...props }) {
  const {
    issue,
    groupId,
    getIssueList,
    issueItemId,
    dragging,
    handleDragStart,
    handleDragEnter,
    managers,
    dragItem,
  } = props;

  const issueList = JSON.parse(localStorage.getItem('issueList'));

  const [isEdit, setIsEdit] = useState(false);

  const openModal = () => setIsEdit(true);
  const closeModal = () => {
    setIsEdit(false);
    getIssueList();
  };

  return (
    <>
      <IssueCardContainer
        onClick={openModal}
        draggable
        onDragStart={(e) => handleDragStart(e, { groupId, issueItemId })}
        onDragEnter={
          dragging && dragItem.current.groupId === groupId
            ? (e) => handleDragEnter(e, { groupId, issueItemId })
            : null
        }
      >
        <p className="title">{issue?.title}</p>
        <p className="manager">{issue?.manager}</p>
        <p className="last-date">{issue?.lastDate}</p>
      </IssueCardContainer>
      {isEdit && (
        <IssueModal
          type="EDIT"
          issue={issue}
          closeModal={closeModal}
          managers={managers}
          issueList={issueList}
          status={issue.status}
        />
      )}
    </>
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
