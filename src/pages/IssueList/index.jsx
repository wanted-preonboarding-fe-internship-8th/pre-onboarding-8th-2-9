import { useEffect, useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toastState } from '../../atom/toast/state';
import Button from '../../components/Button';
import IssueCard from '../../components/IssueCard';
import IssueAddModal from '../../components/IssueModal';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { initialIssueList, managerList } from '../../data';

export default function IssueList() {
  const [isModalOpen, setIsModalOpen] = useState({ open: false, status: '' });
  const [toast, setToast] = useRecoilState(toastState);
  const [issueList, setIssueList] = useState(initialIssueList);
  const [isLoading, setIsLoading] = useState(true);
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const getIssueList = () => {
    if (localStorage.getItem('issueList')) {
      setIssueList(JSON.parse(localStorage.getItem('issueList')));
    }
    setTimeout(() => {
      try {
        setIsLoading(false);
      } catch {
        setToast('error', '잠시 후에 다시 시도해주세요');
      }
    }, 500);
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
        targetList[0].status =
          params.groupId === 0
            ? 'todo'
            : params.groupId === 1
            ? 'progress'
            : 'complete';
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

  const openModal = (status) => {
    setIsModalOpen({ open: true, status: status });
  };

  const closeModal = () => {
    setIsLoading(true);
    setIsModalOpen({ ...isModalOpen, open: false });
    getIssueList();
  };

  useEffect(() => {
    getIssueList();
  }, []);

  useEffect(() => {
    if (!toast) return;
    setTimeout(() => {
      setToast('');
    }, [1500]);
  }, [toast]);

  return (
    <>
      {isLoading && <Loader />}
      <IssueListContainer>
        <header className="header">
          <h1 className="title">ISSUE</h1>
        </header>
        <div className="issue-contents">
          {issueList?.map((group, groupId) => {
            return (
              <div className="todo issue-box" key={group?.title}>
                <div className="issue-header">
                  <p className={`issue-title ${group?.label}-title`}>
                    {group?.title}
                  </p>
                  <Button
                    className="add-btn"
                    width="80px"
                    text="+ 추가"
                    background=""
                    margin=""
                    color="var(--gray-400)"
                    onClick={() => openModal(group?.label)}
                  />
                </div>
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
      {isModalOpen.open && (
        <IssueAddModal
          type="ADD"
          issueList={issueList}
          status={isModalOpen.status}
          setIssueList={setIssueList}
          managers={managerList}
          closeModal={closeModal}
        />
      )}
      {toast.status && <Toast status={toast.status} message={toast.message} />}
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
      & .issue-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;

        & .issue-title {
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
  }
`;
