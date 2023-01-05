import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ISSUE_FORM_LABEL, ISSUE_STATE } from '../../enums';
import Button from '../Button';
import Input from '../Input';
import Index from '../TextArea';

const GROUP_1 = 'To-do';
const GROUP_2 = 'In Progress';
const GROUP_3 = 'Complete';

const selectData = [
  {
    value: GROUP_1,
    name: '할 일',
  },
  {
    value: GROUP_2,
    name: '진행중',
  },
  {
    value: GROUP_3,
    name: '완료',
  },
];

export default function IssueModal({ ...props }) {
  const { onClose, managers, issueList, setIssueList, issue } = props;
  const [isShowManagers, setIsShowManagers] = useState(false);
  const [issueStatus, setIssueStatus] = useState(GROUP_1);
  const [issueInputValue, setIssueInputValue] = useState({
    id: Date.now(),
    title: issue?.title || '',
    manager: issue?.manager || '',
    managerId: 0,
    description: '',
    dueDate: '',
  });

  function groupIndex(groupName) {
    if (groupName === GROUP_1) {
      return 0;
    }
    if (groupName === GROUP_2) {
      return 1;
    }
    if (groupName === GROUP_3) {
      return 2;
    }
  }

  const onChangeStatus = (e) => {
    setIssueStatus(e.target.value);
  };

  const onSubmitAddIssue = (e) => {
    e.preventDefault();
    try {
      setIssues((prev) => {
        let newList = JSON.parse(JSON.stringify(prev)); // deep copy
        let targetList = newList[groupIndex(issueStatus)];
        targetList.items.splice(targetList.length, 0, issueInputValue);
        return newList;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem('issueList', JSON.stringify(issueList));
  }, [onSubmitAddIssue]);

  return (
    <>
      <IssueAddModalContainer>
        <div className="header">
          <h2>ISSUE 등록</h2>
          <Button
            background=""
            text="X"
            color="var(--black)"
            width="50px"
            margin=""
            onClick={() => onClose()}
          />
        </div>

        <form onSubmit={onSubmitAddIssue}>
          <Input
            name="title"
            labelText={ISSUE_FORM_LABEL.TITLE}
            placeholderText="제목을 입력해주세요."
            value={issueInputValue.title}
            onChange={onChangeStatus}
          />
          <div>
            <Input
              name="manager"
              margin="0"
              labelText={ISSUE_FORM_LABEL.MANAGER}
              placeholderText="담당자를 입력해주세요."
              value={issueInputValue.manager}
              onChange={onChangeStatus}
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
            onChange={(e) =>
              setIssueInputValue({
                ...issueInputValue,
                description: e.currentTarget.value,
              })
            }
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
            onChange={(e) =>
              setIssueInputValue({
                ...issueInputValue,
                dueDate: e.target.value,
              })
            }
          />
          <Button text="저장" background="var(--progress)" />
        </form>
      </IssueAddModalContainer>
      <Overlay onClick={() => onClose()} />
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
