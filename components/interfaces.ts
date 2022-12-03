export enum Provider {
  "github" = "github",
  "gitlab" = "gitlab",
  "gitea" = "gitea",
}

export interface IAppStateViewRow {
  issues?: IAppIssueData[];
  id: string;
  title: string;
}
export interface IAppStateViewColumn {
  rows?: IAppStateViewRow[];
  id: string;
  title: string;
}
export interface IAppStateView {
  columns?: IAppStateViewColumn[];
}
export interface IAppIssueLabelData {
  id: string;
  name: string;
  color: string;
  description: string;
}
export interface IAppIssueAssigneeData {
  id: string;
  login: string;
  avatar_url: string;
  url: string;
  type: string;
}
export interface IAppIssueMilestoneData {
  closed_at: string;
  closed_issues: number;
  created_at: string;
  // creator: any;
  description: string;
  due_on: string;
  html_url: string;
  id: string;
  labels_url: string;
  node_id: string;
  number: number;
  open_issues: number;
  state: string;
  title: string;
  updated_at: string;
  url: string;
}
export interface IAppIssueData {
  title: string;
  assignee: IAppIssueAssigneeData;
  assignees: IAppIssueAssigneeData[];
  labels: IAppIssueLabelData[];
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  milestone: IAppIssueMilestoneData;
  url: string;
  html_url: string;
  id: string;
  node_id: string;
  number: number;
  provider: string;
}
export interface IAppDragDropData {
  event: any;
  row: IAppStateViewRow;
  col: IAppStateViewColumn;
}
export interface IAppDragDropIssueData {
  event: any;
  row: IAppStateViewRow;
  col: IAppStateViewColumn;
  issue: IAppIssueData;
}
export interface IAppDragStartData {
  event: any;
  row: IAppStateViewRow;
  col: IAppStateViewColumn;
  issue: IAppIssueData;
}
export interface IAppDragOverData {
  event: any;
  row: IAppStateViewRow;
  col: IAppStateViewColumn;
}
export interface IAppDragOverissueData {
  event: any;
  row: IAppStateViewRow;
  col: IAppStateViewColumn;
  issue: IAppIssueData;
}
export interface IAppColumnProps {
  children?: any;
  colData: IAppStateViewColumn;
}
export interface IAppRowProps {
  children?: any;
  colData: IAppStateViewColumn;
  rowData: IAppStateViewRow;
  onDragOver?: any;
  onDrop?: any;
}
export interface IAppIssueProps {
  children?: any;
  colData: IAppStateViewColumn;
  issueData: IAppIssueData;
  rowData: IAppStateViewRow;
  onDrag?: any;
  onDragOver?: any;
  onDrop?: any;
}
export interface IAppModalProps {
  showModal: boolean;
  setShowModal: any;
  title: string;
  children?: any;
  fullWidth: boolean;
}
export interface IAppNavBarProps {
  showSettings: any;
  showAbout: any;
}
export interface IAppSettingsRepoProps {
  domain: string;
  name: string;
  url: string;
  provider: Provider;
  apikey: string;

  children: any;
  index: number;
  edit: boolean;
  emitSaveSource: any;
  emitRemoveSource: any;
}
export interface IAppSettingsProps {
  sources: IAppSettingsSource[];
  columnsMode: string;
  rowsMode: string;
  onEditSources: any;
  onEditColumnsMode: any;
  onEditRowsMode: any;
}
export interface IAppSettingsSource {
  provider: Provider;
  name: string;
  url: string;
  apikey: string;
  domain?: string;
}
export interface IAppSettingsState {
  theme: "light" | "dark";
  viewColumnsMode: "state" | "milestone" | "assignee" | "label";
  viewRowsMode: "state" | "milestone" | "assignee" | "label";
  sources?: IAppSettingsSource[];
  issues?: IAppIssueData[];
  view: IAppStateView;
  showAbout: boolean;
  showSettings: boolean;
  dragggingData?: IAppDragStartData;
  droppingData?: IAppDragOverData;
}
export interface IAppSettingsAction {
  command:
    | "drag-issue"
    | "drag-over"
    | "drag-drop"
    | "drag-over-issue"
    | "drag-drop-issue"
    | "issues-data-load-start"
    | "issues-data-push"
    | "issues-data-load-complete"
    | "modal-about-show-toggle"
    | "modal-settings-show-toggle"
    | "modal-settings-save-sources"
    | "sources-data-push"
    | "sources-data-save"
    | "refresh-view"
    | "toggle-theme"
    | "view-mode-columns"
    | "view-mode-rows";
  issuesData?: IAppIssueData[];
  sourcesData?: IAppSettingsSource[];
  dragStartData?: IAppDragStartData;
  dragOverData?: IAppDragOverData;
  dragDropData?: IAppDragDropData;
  dragDropissueData?: IAppDragDropIssueData;
  dragOverissueData?: IAppDragOverissueData;
  viewModeRow?: "state" | "milestone" | "assignee" | "label";
  viewModeCol?: "state" | "milestone" | "assignee" | "label";
}
export interface IAppSimpleBoard {
  boardState: IAppSettingsState;
  boardDispatch: CallableFunction;
}
