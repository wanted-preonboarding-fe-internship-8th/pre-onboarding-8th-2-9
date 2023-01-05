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
