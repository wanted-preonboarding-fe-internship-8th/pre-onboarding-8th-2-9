import { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toastState } from '../../atom/toast/state';
import { ISSUE_FORM_LABEL, ISSUE_STATE } from '../../enums';
import useInput from '../../hooks/useInput';
import Button from '../Button';
import Input from '../Input';
import Index from '../TextArea';

export default function IssueModal({ ...props }) {
  const { type, issueList, closeModal, status, managers, issue } = props;
  const [toast, setToast] = useRecoilState(toastState);
  const [searchInput, setSearchInput] = useState('');
  const [searchedManagers, setSearchedManagers] = useState(managers);
  const [issueInputValue, setIssueInputValue] = useInput({
    id: issue?.id || Date.now(),
    title: issue?.title || '',
    manager: issue?.manager || '',
    managerId: 0,
    description: issue?.description || '',
    status: status,
    lastDate: issue?.lastDate || '',
  });

  const onSubmitHandleIssue = () => {
    const groupIndex = issueList.findIndex(
      (group) => group.label === issueInputValue.status
    );

    const issueIndex = issueList[groupIndex].items?.findIndex(
      (item) => item.id === issueInputValue.id
    );
    try {
      type === 'ADD'
        ? (issueList[groupIndex].items = [
            ...issueList[groupIndex].items,
            issueInputValue,
          ])
        : (issueList[groupIndex].items[issueIndex] = issueInputValue);
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
          onChange={setIssueInputValue}
        />
        <div>
          <Input
            name="manager"
            margin="0"
            labelText={ISSUE_FORM_LABEL.MANAGER}
            placeholderText="담당자를 입력해주세요."
            value={searchInput}
            onChange={searchManagers}
          />
          <ul className="manager-list">
            {searchedManagers.map((manager) => {
              return (
                <li
                  data-name="manager"
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
          name="description"
          labelText={ISSUE_FORM_LABEL.CONTENT}
          placeholderText="내용을 입력해주세요."
          value={issueInputValue.description}
          onChange={setIssueInputValue}
        />
        <Input
          type="datetime-local"
          name="lastDate"
          labelText={ISSUE_FORM_LABEL.DUE_DATE}
          value={issueInputValue.lastDate}
          placeholderText="마감일을 입력해주세요."
          onChange={setIssueInputValue}
        />
        <Button
          text="저장"
          background="var(--progress)"
          onClick={onSubmitHandleIssue}
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
