import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';
import IssueCard from '../../components/IssueCard';
import IssueAddModal from '../../components/IssueModal';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { managerList } from '../../temp';

export default function IssueList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueList, setIssueList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getIssueList = useCallback(async () => {
    if (!localStorage.getItem('issueList')) {
      return;
    }
    setIssueList(JSON.parse(localStorage.getItem('issueList')));
    //todo: sort
    //todo: add 시, loading 풀림
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getIssueList();
      setIsLoading(false);
    }, 2000);
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
          <div className="todo issue-box">
            <p className="issue-title todo-title">할 일</p>
            <ul onDragOver={(e) => e.preventDefault()}>
              {issueList?.map(
                (issue, idx) =>
                  issue.status === 'todo' && (
                    <IssueCard key={idx} issue={issue} />
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
                    <IssueCard key={idx} issue={issue} />
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
                    <IssueCard key={idx} issue={issue} />
                  )
              )}
            </ul>
          </div>
        </div>
      </IssueListContainer>

      {isModalOpen && (
        <IssueAddModal
          type="ADD"
          issueList={issueList}
          setIssueList={setIssueList}
          managers={managerList}
          onClose={() => {
            getIssueList();
            setIsModalOpen(false);
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
