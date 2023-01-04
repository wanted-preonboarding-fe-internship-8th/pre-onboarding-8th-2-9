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
    items: [],
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

  useEffect(() => {
    getIssueList();
  }, [getIssueList]);

  return (
    <>
      {console.log(issueList)}
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
              <div className="todo issue-box" key={issueGroup.title}>
                <p className="issue-title todo-title"> {issueGroup.title} </p>
                {issueGroup.items?.map((issueItem, issueItemId) => {
                  return (
                    <IssueCard
                      key={issueItem.idx}
                      title={issueItem.title}
                      manager={issueItem.manager}
                      lastDate={issueItem.lastDate}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* <div className="issue-contents">
          <div className="todo issue-box">
            <p className="issue-title todo-title">할 일</p>
            <ul onDragOver={(e) => e.preventDefault()}>
              {issueList?.map(
                (issue, idx) =>
                  issue.status === 'todo' && (
                    <IssueCard
                      key={idx}
                      title={issue.title}
                      manager={issue.manager}
                      lastDate={issue.lastDate}
                    />
                  )
              )}
            </ul>
          </div>
          <div className="progress issue-box">
            <p className="issue-title progress-title">진행중</p>
            <ul onDragOver={(e) => e.preventDefault()}>
              {issueList?.map(
                (issue, idx) =>
                  issue.status === 'progress' && (
                    <IssueCard
                      key={idx}
                      title={issue.title}
                      manager={issue.manager}
                      lastDate={issue.lastDate}
                    />
                  )
              )}
            </ul>
          </div>
          <div className="complete issue-box">
            <p className="issue-title complete-title">완료</p>
            <ul onDragOver={(e) => e.preventDefault()}>
              {issueList?.map(
                (issue, idx) =>
                  issue.status === 'complete' && (
                    <IssueCard
                      key={idx}
                      title={issue.title}
                      manager={issue.manager}
                      lastDate={issue.lastDate}
                    />
                  )
              )}
            </ul>
          </div>
        </div> */}
      </IssueListContainer>
      {isModalOpen && (
        <IssueAddModal
          issueList={issueList}
          onClose={() => {
            setIsModalOpen(false);
            getIssueList();
          }}
          managers={managerList}
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
