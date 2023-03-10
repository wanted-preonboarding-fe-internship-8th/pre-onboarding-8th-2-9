import { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toastState } from '../../atom/toast/state';
import {
  ISSUE_FORM_LABEL,
  ISSUE_FORM_NAME,
  ISSUE_FORM_PLACEHOLDER,
  ISSUE_MODAL_TITLE,
  ISSUE_STATE,
} from '../../enums';
import useInput from '../../hooks/useInput';
import Button from '../Button';
import Input from '../Input';
import Index from '../TextArea';

export default function IssueModal({ ...props }) {
  const { type, issueList, closeModal, status, managers, issue } = props;
  const [toast, setToast] = useRecoilState(toastState);
  const [searchInput, setSearchInput] = useState(issue?.manager || '');
  const [searchedManagers, setSearchedManagers] = useState(managers);
  const STATUS_INDEX = status === 'todo' ? 0 : status === 'progress' ? 1 : 2;

  const [issueInputValue, setIssueInputValue] = useInput({
    id: issue?.id || Date.now(),
    title: issue?.title || '',
    manager: issue?.manager || '',
    managerId: 0,
    description: issue?.description || '',
    status: status,
    lastDate: issue?.lastDate || '',
  });

  const searchManagers = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value === '') {
      setSearchedManagers(managers);
      return;
    }
    const searchedManagers = managers.filter((manager) =>
      manager.name.includes(e.target.value)
    );
    setSearchedManagers(searchedManagers);
  };

  const clickManagerChip = (manager, e) => {
    setSearchInput(manager.name);
  };

  const onDeleteIssue = () => {
    try {
      const newList = issueList[STATUS_INDEX].items.filter(
        (item) => item.id !== issueInputValue.id
      );
      issueList[STATUS_INDEX].items = newList;
      localStorage.setItem('issueList', JSON.stringify(issueList));
      setToast({
        status: 'success',
        message: '삭제되었습니다.',
      });
      closeModal();
    } catch {
      setToast({
        status: 'error',
        message: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  const onSubmitHandleIssue = () => {
    const issueIndex = issueList[STATUS_INDEX].items?.findIndex(
      (item) => item.id === issueInputValue.id
    );
    try {
      type === 'ADD'
        ? (issueList[STATUS_INDEX].items = [
            ...issueList[STATUS_INDEX].items,
            issueInputValue,
          ])
        : (issueList[STATUS_INDEX].items[issueIndex] = issueInputValue);
      localStorage.setItem('issueList', JSON.stringify(issueList));
      setToast({
        status: 'success',
        message:
          type === 'ADD'
            ? '성공적으로 등록되었습니다.'
            : '성공적으로 수정되었습니다.',
      });
      closeModal();
    } catch {
      setToast({
        status: 'error',
        message: '잠시 후 다시 시도해주세요.',
      });
      closeModal();
    }
  };

  return (
    <>
      <IssueAddModalContainer>
        <div className="header">
          <h2>
            ISSUE{' '}
            {type === 'EDIT' ? ISSUE_MODAL_TITLE.EDIT : ISSUE_MODAL_TITLE.ADD}
          </h2>
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
          name={ISSUE_FORM_NAME.TITLE}
          labelText={ISSUE_FORM_LABEL.TITLE}
          placeholderText={ISSUE_FORM_PLACEHOLDER.TITLE}
          value={issueInputValue.title}
          onChange={setIssueInputValue}
        />
        <div>
          <Input
            name={ISSUE_FORM_NAME.MANAGER}
            margin="0"
            labelText={ISSUE_FORM_LABEL.MANAGER}
            placeholderText={ISSUE_FORM_PLACEHOLDER.MANAGER}
            value={searchInput}
            onChange={searchManagers}
          />
          <ul className="manager-list">
            {searchedManagers.map((manager) => {
              return (
                <li
                  data-name={ISSUE_FORM_NAME.MANAGER}
                  key={manager.id}
                  className="manager cursor-pointer"
                >
                  <p
                    className="chip"
                    style={{ background: `var(--manager-${manager.id})` }}
                    onClick={(e) => {
                      setIssueInputValue(e);
                      clickManagerChip(manager, e);
                    }}
                  >
                    {manager.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
        <Index
          name={ISSUE_FORM_NAME.DESCRIPTION}
          labelText={ISSUE_FORM_LABEL.DESCRIPTION}
          placeholderText={ISSUE_FORM_PLACEHOLDER.DESCRIPTION}
          value={issueInputValue.description}
          onChange={setIssueInputValue}
        />
        <Input
          type="datetime-local"
          name={ISSUE_FORM_NAME.LAST_DATE}
          labelText={ISSUE_FORM_LABEL.LAST_DATE}
          value={issueInputValue.lastDate}
          placeholderText={ISSUE_FORM_PLACEHOLDER.LAST_DATE}
          onChange={setIssueInputValue}
        />
        <div className="issue-btn-handler">
          <Button
            text="삭제"
            background="var(--error)"
            margin="0 20px 0 0"
            height="50px"
            onClick={onDeleteIssue}
          />
          <Button
            text="저장"
            margin=""
            height="50px"
            background="var(--progress)"
            onClick={onSubmitHandleIssue}
          />
        </div>
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
    display: flex;
    flex-direction: row;
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
  & .issue-btn-handler {
    display: flex;
    height: 48px;
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
