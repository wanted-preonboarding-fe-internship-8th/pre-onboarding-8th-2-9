import { useCallback, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';
import IssueCard from '../../components/IssueCard';
import IssueAddModal from '../../components/IssueModal';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { managerList } from '../../temp';

const GROUP_1 = 'To-do';
const GROUP_2 = 'In Progress';
const GROUP_3 = 'Complete';

const initialIssueList = [
  {
    title: GROUP_1,
    items: [
      {
        title: 'hey',
        manager: '김다희',
        dueDate: new Date().getDate(),
        groupId: 0,
        issueItemId: new Date().getDate(),
      },
    ],
  },
  {
    title: GROUP_2,
    items: [],
  },
  {
    title: GROUP_3,
    items: [],
  },
];

export default function IssueList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueList, setIssueList] = useState(initialIssueList);
  const [isLoading, setIsLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const getIssueList = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    //todo: sort
    if (localStorage.getItem('issueList')) {
      setIssueList(JSON.parse(localStorage.getItem('issueList')));
    }
  }, []);

  const handleDragStart = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setDragging(true);
  };

  const handleDragEnter = (e, params) => {
    const currentItem = dragItem.current;
    if (e.target !== dragNode.current) {
      setIssueList((prev) => {
        let newList = JSON.parse(JSON.stringify(prev)); // deep copy
        let targetList = newList[params.groupId].items;
        let selectedList = newList[currentItem.groupId].items;
        targetList.splice(
          params.issueItemId,
          0,
          selectedList.splice(currentItem.itemI, 1)[0]
        );
        dragItem.current = params;
        return newList;
      });
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragNode.current.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  useEffect(() => {
    getIssueList();
  }, [getIssueList]);

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
            onClick={() => setIsModalOpen(true)}
          />
        </header>
        <div className="issue-contents">
          {issueList.map((issueGroup, groupId) => {
            return (
              <div
                className="todo issue-box"
                key={issueGroup.title}
                onDragEnter={
                  dragging && !issueGroup?.items.length
                    ? (e) => handleDragEnter(e, { groupId, issueItemId: 0 })
                    : null
                }
              >
                <p className="issue-title todo-title"> {issueGroup.title} </p>
                {issueGroup.items?.map((issueItem, issueItemId) => {
                  return (
                    <IssueCard
                      key={`${issueGroup.title}-${issueItemId}`}
                      title={issueItem.title}
                      manager={issueItem.manager}
                      dueDate={issueItem.dueDate}
                      groupId={groupId}
                      issueItemId={issueItemId}
                      dragging={dragging}
                      handleDragStart={handleDragStart}
                      handleDragEnter={handleDragEnter}
                      handleDragEnd={handleDragEnd}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </IssueListContainer>
      {isModalOpen && (
        <IssueAddModal
          issueList={issueList}
          setIssueList={setIssueList}
          managers={managerList}
          onClose={() => {
            setIsModalOpen(false);
            getIssueList();
          }}
        />
      )}
      {/* todo: recoil 변경 -> 각 파트에서 예외처리 */}
      <Toast status="error" message="등록에 실패했습니다." />
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
