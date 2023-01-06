import { ISSUE_STATE } from '../enums';

export const initialIssueList = [
  {
    title: ISSUE_STATE.TODO.label,
    label: ISSUE_STATE.TODO.value,
    items: [],
  },
  {
    title: ISSUE_STATE.IN_PROGRESS.label,
    label: ISSUE_STATE.IN_PROGRESS.value,
    items: [],
  },
  {
    title: ISSUE_STATE.COMPLETE.label,
    label: ISSUE_STATE.COMPLETE.value,
    items: [],
  },
];

export const managerList = [
  {
    id: 1,
    name: '김다희',
  },
  {
    id: 2,
    name: '김종한',
  },
  {
    id: 3,
    name: '나덕경',
  },
  {
    id: 4,
    name: '신원세',
  },
  {
    id: 5,
    name: '이슬기',
  },
  {
    id: 6,
    name: '정규용',
  },
];
