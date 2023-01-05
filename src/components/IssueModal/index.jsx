import { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toastState } from '../../atom/toast/state';
import { ISSUE_FORM_LABEL, ISSUE_STATE } from '../../enums';
import Button from '../Button';
import Input from '../Input';
import Index from '../TextArea';

export default function IssueModal({ ...props }) {
  const { type, closeModal, managers, issueList, issue } = props;
  const [toast, setToast] = useRecoilState(toastState);
  const [isShowManagers, setIsShowManagers] = useState(false);
  const [issueStatus, setIssueStatus] = useState(issue?.state);
  const [issueInputValue, setIssueInputValue] = useState({
    id: issue?.id || Date.now(),
    title: issue?.title || '',
    manager: issue?.manager || '',
    managerId: 0,
    description: issue?.description || '',
    status: issue?.status || 'todo',
    lastDate: issue?.lastDate || '',
  });

  const onChangeStatus = (e) => {
    setIssueInputValue({
      ...issueInputValue,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitAddIssue = () => {
    const groupIndex = issueList.findIndex(
      (group) => group.label === issueInputValue.status
    );
    issueList[groupIndex].items = [
      ...issueList[groupIndex].items,
      issueInputValue,
    ];
    localStorage.setItem('issueList', JSON.stringify(issueList));
    setToast({ status: 'success', message: '성공적으로 등록되었습니다.' });
    closeModal();
  };

  const onSubmitEditIssue = () => {
    const issueList = JSON.parse(localStorage.getItem('issueList'));
    const groupIndex = issueList?.findIndex(
      (group) => group.label === issueInputValue.status
    );
    const issueIndex = issueList[groupIndex]?.items.findIndex(
      (item) => item.id === issueInputValue.id
    );
    issueList[groupIndex].items[issueIndex] = issueInputValue;
    localStorage.setItem('issueList', JSON.stringify(issueList));
    setToast({ status: 'success', message: '성공적으로 수정되었습니다.' });
    closeModal();
  };

  const handleTitleInput = (e) => {
    setIssueInputValue({
      ...issueInputValue,
      title: e.currentTarget.value,
    });
  };

  const handleManagerInput = (e) => {
    setIssueInputValue({
      ...issueInputValue,
      manager: e.currentTarget.value,
    });
  };

  const handleDescriptionInput = (e) => {
    setIssueInputValue({
      ...issueInputValue,
      description: e.currentTarget.value,
    });
  };

  const handleLastDateInput = (e) => {
    setIssueInputValue({
      ...issueInputValue,
      lastDate: e.currentTarget.value,
    });
  };

  return (
    <>
      <IssueAddModalContainer>
        <div className="header">
          <h2>ISSUE {type === 'EDIT' ? '수정' : '등록'}</h2>
          <Button
            background=""
            text="X"
            color="var(--black)"
            width="50px"
            margin=""
            onClick={closeModal}
          />
        </div>
        <Input
          name="title"
          labelText={ISSUE_FORM_LABEL.TITLE}
          placeholderText="제목을 입력해주세요."
          value={issueInputValue.title}
          onChange={(e) => handleTitleInput(e)}
        />
        <div>
          <Input
            name="manager"
            margin="0"
            labelText={ISSUE_FORM_LABEL.MANAGER}
            placeholderText="담당자를 입력해주세요."
            value={issueInputValue.manager}
            onChange={(e) => handleManagerInput(e)}
            onClick={() => setIsShowManagers(true)}
          />
          {isShowManagers && (
            <ul className="manager-list">
              {issueInputValue.manager &&
                managers?.map(
                  (manager, idx) =>
                    manager.name.includes(issueInputValue.manager) &&
                    manager.name !== issueInputValue.manager && (
                      <li
                        key={idx}
                        className="manager cursor-pointer"
                        onClick={() =>
                          setIssueInputValue({
                            ...issueInputValue,
                            manager: manager.name,
                          })
                        }
                      >
                        <p
                          className="chip"
                          style={{
                            background: `var(--manager-${manager.id})`,
                          }}
                        >
                          {manager.name}
                        </p>
                      </li>
                    )
                )}
              {!issueInputValue.manager &&
                managers?.map((manager, idx) => (
                  <li
                    key={manager.id}
                    className="manager cursor-pointer"
                    onClick={() =>
                      setIssueInputValue({
                        ...issueInputValue,
                        manager: manager.name,
                      })
                    }
                  >
                    <p
                      className="chip"
                      style={{ background: `var(--manager-${manager.id})` }}
                    >
                      {manager.name}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <Index
          name="description"
          labelText={ISSUE_FORM_LABEL.CONTENT}
          placeholderText="내용을 입력해주세요."
          value={issueInputValue.description}
          onChange={(e) => handleDescriptionInput(e)}
        />
        <p className="title">상태</p>
        <select
          name="status"
          value={issueInputValue.status}
          className="status-select"
          onChange={onChangeStatus}
        >
          {Object.values(ISSUE_STATE).map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
        <Input
          type="datetime-local"
          name="lastDate"
          labelText={ISSUE_FORM_LABEL.DUE_DATE}
          value={issueInputValue.lastDate}
          placeholderText="마감일을 입력해주세요."
          onChange={(e) => handleLastDateInput(e)}
        />
        <Button
          text="저장"
          background="var(--progress)"
          onClick={type === 'ADD' ? onSubmitAddIssue : onSubmitEditIssue}
        />
      </IssueAddModalContainer>
      <Overlay onClick={closeModal} />
    </>
  );
}

const IssueAddModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 20px;
  width: 500px;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  background-color: var(--white);
  border-radius: 10px;

  & .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  & .manager-list {
    text-align: left;
    & .manager {
      & .chip {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
        border-radius: 15px;
        width: 60px;
        height: 23px;
        font-size: 14px;
        &:first-child {
          margin-top: 10px;
        }
      }
    }
  }

  & .title {
    text-align: left;
    font-size: 14px;
  }

  & .status-select {
    margin: 5px 0 15px 0;
    padding: 10px;
    text-align: left;
    width: 100%;
    background: var(--white);
    border: 1px solid var(--gray-400);
    border-radius: 10px;
    box-sizing: border-box;
    line-height: 1.5;
    text-overflow: ellipsis;
    font-size: 16px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9;
`;
