import { useEffect, useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toastState } from '../../atom/toast/state';
import Button from '../../components/Button';
import IssueCard from '../../components/IssueCard';
import IssueAddModal from '../../components/IssueModal';
import Loader from '../../components/Loader';
import { initialIssueList, managerList } from '../../data';

export default function IssueList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useRecoilState(toastState);
  const [issueList, setIssueList] = useState(initialIssueList);
  const [isLoading, setIsLoading] = useState(true);
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const getIssueList = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    if (localStorage.getItem('issueList')) {
      setIssueList(JSON.parse(localStorage.getItem('issueList')));
    }
  };

  const handleDragStart = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current?.addEventListener('dragend', handleDragEnd);
    setDragging(true);
  };

  const handleDragEnter = (e, params) => {
    const currentItem = dragItem.current;
    if (e.target !== dragNode.current) {
      setIssueList((prev) => {
        const newList = JSON.parse(JSON.stringify(prev)); // deep copy
        const targetList = newList[params.groupId]?.items;
        const selectedList = newList[currentItem?.groupId]?.items;
        targetList?.splice(
          params.issueItemId,
          0,
          selectedList?.splice(currentItem?.issueItemId, 1)[0]
        );
        dragItem.current = params;
        return newList;
      });
      localStorage.setItem('issueList', JSON.stringify(issueList));
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragNode.current?.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    getIssueList();
  };

  useEffect(() => {
    getIssueList();
  }, []);

  useEffect(() => {
    if (!toast) return;
    setTimeout(() => setToast(''), [1500]);
  }, [toast]);

  return (
    <>
      {isLoading && <Loader />}
      <IssueListContainer>
        <header className="header">
          <h1 className="title">ISSUE</h1>
          <Button
            className="add-btn"
            width="100px"
            text="+ 추가"
            background="var(--progress)"
            onClick={openModal}
          />
        </header>
        <div className="issue-contents">
          {issueList.map((group, groupId) => {
            return (
              <div className="todo issue-box" key={group?.title}>
                <p className={`issue-title ${group?.label}-title`}>
                  {group?.title}
                </p>
                <ul
                  onDragEnter={
                    dragging && dragItem.current.groupId !== groupId
                      ? (e) => handleDragEnter(e, { groupId, issueItemId: 0 })
                      : null
                  }
                  style={{ height: '100vh' }}
                >
                  {group?.items?.map((issue, issueItemId) => {
                    return (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        issueItemId={issueItemId}
                        getIssueList={getIssueList}
                        group={group}
                        groupId={groupId}
                        dragging={dragging}
                        handleDragStart={handleDragStart}
                        handleDragEnter={handleDragEnter}
                        issueList={issueList}
                        managers={managerList}
                        dragItem={dragItem}
                      />
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </IssueListContainer>
      {isModalOpen && (
        <IssueAddModal
          type="ADD"
          issueList={issueList}
          setIssueList={setIssueList}
          managers={managerList}
          closeModal={closeModal}
        />
      )}
    </>
  );
}

const IssueListContainer = styled.div`
  & .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & .title {
      font-size: 24px;
    }
  }
  & .issue-contents {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    & .issue-box {
      width: 260px;
      & .issue-title {
        margin-bottom: 15px;
        font-size: 20px;
      }
      & .todo-title {
        color: var(--gray-400);
      }
      & .progress-title {
        color: var(--progress);
      }
      & .complete-title {
        color: var(--complete);
      }
    }
  }
`;
