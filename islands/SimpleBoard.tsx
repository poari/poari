import { useEffect, useReducer } from "preact/hooks";
import { apiFetchRepoIssues } from "../components/api.ts";
import {
  appAboutRepoUrl,
  appAboutText,
  AppColumn,
  AppIssue,
  AppModal,
  AppNavBar,
  appPayoff,
  AppRow,
  AppSettings,
  appTitle,
  appVersion,
} from "../components/shared.tsx";
import {
  IAppIssueData,
  IAppSettingsAction,
  IAppSettingsSource,
  IAppSettingsState,
  IAppSimpleBoard,
  IAppStateView,
  IAppStateViewColumn,
  Provider,
} from "../components/interfaces.ts";

const localStorageSourcesKey = "poari-sources";

const defaultSources: IAppSettingsSource[] = [
  {
    name: "denoland/deno",
    url: "denoland/deno",
    domain: "",
    apikey: "",
    provider: Provider.github,
  },
  {
    name: "denoland/fresh",
    url: "denoland/fresh",
    domain: "",
    apikey: "",
    provider: Provider.github,
  },
];

const appSettingsInitialState: IAppSettingsState = {
  theme: "light",
  sources: [],
  view: {
    columns: [],
  },
  showAbout: true,
  showSettings: false,
  viewColumnsMode: "label",
  viewRowsMode: "milestone",
};

const getIssues = (
  state: IAppSettingsState,
  colRuleName: string,
  rowRuleName: string,
) => {
  const getIsIn = (issue: IAppIssueData, rule: string, value: string) => {
    if (rule == "state") {
      return issue.state == value;
    } else if (rule == "label") {
      return issue.labels.filter((l) => l.name == value).length > 0 ||
        (value == "" &&
          issue.labels.length == 0);
    } else if (rule == "assignee") {
      return issue.assignees.filter((l) => l.login == value).length > 0 ||
        (value == "" &&
          issue.assignees.length == 0);
    } else if (rule == "milestone") {
      return issue?.milestone?.title == value || value == "";
    }
    return false;
  };
  const filterIssuesForRowCol = (
    issue: IAppIssueData,
    columnsMode: string,
    rowsMode: string,
  ) => {
    const isInCol = getIsIn(issue, state.viewColumnsMode, columnsMode);
    const isInRow = getIsIn(issue, state.viewRowsMode, rowsMode);
    return isInCol && isInRow;
  };
  return state.issues?.filter((issue) => {
    return filterIssuesForRowCol(
      issue,
      colRuleName,
      rowRuleName,
    );
  });
};

const getViewRows = (
  state: IAppSettingsState,
  colRuleName: string,
) => {
  const mapIssuesToRows = (issue: IAppIssueData, rowsMode: string) => {
    if (rowsMode == "state") {
      return [issue.state];
    } else if (rowsMode == "label") {
      return issue.labels.map((l) => l.name);
    } else if (rowsMode == "assignee") {
      return issue.assignees.map((l) => l.login);
    } else if (rowsMode == "milestone") {
      return [issue.milestone?.title || ""];
    }
    return [""];
  };
  const rows = () => {
    const rows = [
      ...new Set(
        (state.issues || []).map((i) => {
          return mapIssuesToRows(i, state.viewRowsMode);
        }).flat(1).filter((x) => x.length > 0),
      ),
    ];
    // pushing an empty row for empty values.
    rows.push("");
    const mapped = rows.sort().map((labelRule, pos) => {
      return {
        id: pos.toString(),
        title: labelRule,
        issues: getIssues(state, colRuleName, labelRule),
      };
    });
    return mapped;
  };

  return rows();
};

const getViewCols = (
  state: IAppSettingsState,
): IAppStateViewColumn[] => {
  const mapIssuesToCols = (issue: IAppIssueData, columnsMode: string) => {
    if (columnsMode == "state") {
      return [issue.state];
    } else if (columnsMode == "label") {
      return issue.labels.map((l) => l.name);
    } else if (columnsMode == "assignee") {
      return issue.assignees.map((l) => l.login);
    } else if (columnsMode == "milestone") {
      return issue?.milestone?.title || "";
    }
    return [""];
  };
  const cols = () => {
    const cols = [
      ...new Set(
        (state.issues || []).map((i) => {
          return mapIssuesToCols(i, state.viewColumnsMode);
        }).flat(1).filter((x) => x.length > 0),
      ),
    ];
    // pushing an empty row for empty values.
    cols.push("");
    const mapped = cols.map((colname: string, index) => {
      return {
        id: (index + 1).toString(),
        title: colname.toString(),
        rows: getViewRows(state, colname),
      };
    });

    return mapped;
  };

  return cols();
};

const getView = (
  state: IAppSettingsState,
): IAppStateView => {
  const cols: IAppStateViewColumn[] = getViewCols(state);
  const view = {
    columns: cols,
  };
  return view;
};

const AppSimpleBoard = (props: IAppSimpleBoard) => {
  const { boardState, boardDispatch } = props;
  return (
    <div class="h-screen p-0">
      <AppNavBar
        showSettings={() =>
          boardDispatch({
            command: "modal-settings-show-toggle",
          })}
        showAbout={() =>
          boardDispatch({
            command: "modal-about-show-toggle",
          })}
      />
      <AppModal
        title="Settings"
        showModal={boardState.showSettings}
        fullWidth={true}
        setShowModal={(event: boolean) =>
          boardDispatch({
            command: "modal-settings-show-toggle",
            settingsModalOpen: event,
          })}
      >
        <AppSettings
          columnsMode={boardState.viewColumnsMode}
          rowsMode={boardState.viewRowsMode}
          sources={boardState.sources || []}
          onEditRowsMode={(e: any) =>
            boardDispatch({
              command: "view-mode-rows",
              viewModeRow: e,
            })}
          onEditColumnsMode={(e: any) =>
            boardDispatch({
              command: "view-mode-columns",
              viewModeCol: e,
            })}
          onEditSources={(e: any) =>
            boardDispatch({
              command: "modal-settings-save-sources",
              sourcesData: e,
            })}
        />
      </AppModal>
      <AppModal
        title={`About ${appTitle}`}
        showModal={boardState.showAbout}
        fullWidth={false}
        setShowModal={(event: boolean) =>
          boardDispatch({
            command: "modal-about-show-toggle",
            settingsModalOpen: event,
          })}
      >
        <p class="m-4">{appPayoff}</p>
        <div class="m-2 border rounded">
          <p class="m-2">
            Issues are fetched at client-side, for private repositories provide
            an apikey (personal access token), everything stays in your browser
            localstorage.
          </p>
          <p class="m-2">
            Only Github and Gitlab issues fetching is supported at the moment.
          </p>
          <p class="m-2">
            Issues, feedbacks, feature requests, pull requests are very welcome!
          </p>
        </div>
        <p class="m-4">
          <a href={appAboutRepoUrl} target="_blank">
            Read more at {appAboutRepoUrl}
          </a>
        </p>
        <p>{appAboutText}</p>
        <p>{appTitle} v.{appVersion}</p>
        <p class="grid place-items-center mt-2">
          <a href="https://fresh.deno.dev">
            <img
              width="197"
              height="37"
              src="https://fresh.deno.dev/fresh-badge.svg"
              alt="Made with Fresh"
            />
          </a>
        </p>
      </AppModal>
      <div
        class={`grid grid-cols-${
          boardState.view?.columns?.length || 0
        } gap-5 p-2 ml-2 mr-2`}
      >
        {boardState.view.columns &&
          boardState.view.columns.map((col) => (
            <AppColumn key={col.id} colData={col}>
              {col.rows &&
                col.rows.map((row) => (
                  <AppRow
                    key={col.id + "-" + row.id}
                    rowData={row}
                    colData={col}
                    onDrop={(event: any) =>
                      boardDispatch({
                        command: "drag-drop",
                        dragDropData: {
                          event: event,
                          row: row,
                          col: col,
                        },
                      })}
                    onDragOver={(event: any) =>
                      boardDispatch({
                        command: "drag-over",
                        dragOverData: {
                          event: event,
                          row: row,
                          col: col,
                        },
                      })}
                  >
                    {row.issues &&
                      row.issues.map((issue) => (
                        <AppIssue
                          issueData={issue}
                          rowData={row}
                          colData={col}
                          onDrag={(event: any) =>
                            boardDispatch({
                              command: "drag-issue",
                              dragStartData: {
                                event: event,
                                row: row,
                                col: col,
                                issue: issue,
                              },
                            })}
                          onDrop={(event: any) =>
                            boardDispatch({
                              command: "drag-drop-issue",
                              dragDropissueData: {
                                event: event,
                                row: row,
                                col: col,
                                issue: issue,
                              },
                            })}
                          onDragOver={(event: any) =>
                            boardDispatch({
                              command: "drag-over-issue",
                              dragOverissueData: {
                                event: event,
                                row: row,
                                col: col,
                                issue: issue,
                              },
                            })}
                        >
                        </AppIssue>
                      ))}
                  </AppRow>
                ))}
            </AppColumn>
          ))}
      </div>
    </div>
  );
};

const AppSettingsReducer = (
  state: IAppSettingsState,
  action: IAppSettingsAction,
) => {
  switch (action.command) {
    case "drag-issue":
      action.dragStartData?.event.preventDefault();
      return {
        ...state,
        dragggingData: action.dragStartData,
      };
    case "drag-over":
      action.dragOverData?.event.preventDefault();
      return {
        ...state,
        droppingData: action.dragOverData,
      };
    case "drag-drop":
      action.dragDropData?.event.preventDefault();

      // exiting drop if dropping and draggging are same col and row
      if (
        !state.dragggingData || !action.dragDropData?.row.issues ||
        (state.droppingData?.row?.id == state.dragggingData.row.id &&
          state.droppingData?.col?.id == state.dragggingData.col.id)
      ) {
        return {
          ...state,
        };
      }

      // pushing the issue in target row
      state.droppingData?.row?.issues?.push(state.dragggingData.issue);

      // removing the issue from source row
      state.dragggingData.row.issues = (state?.dragggingData?.row?.issues || [])
        .filter((
          issue: IAppIssueData,
        ) => issue.id != state.dragggingData?.issue.id);

      return {
        ...state,
      };
    case "drag-over-issue":
      action.dragOverissueData?.event.preventDefault();
      return {
        ...state,
      };
    // deno-lint-ignore no-case-declarations
    case "drag-drop-issue":
      action.dragDropissueData?.event.preventDefault();
      if (!state.dragggingData) {
        return {
          ...state,
        };
      }

      // FIXME: fix sorting issues inside row.
      const movingRow = state.dragggingData.row;
      const movingissue = state.dragggingData.issue;
      const movingissuePos = movingRow.issues?.indexOf(movingissue);
      const movingissues = movingRow.issues || [];
      movingissues[0] =
        movingissues.splice(movingissuePos || -1, 1, movingissues[0])[0];

      return {
        ...state,
      };
    case "modal-about-show-toggle":
      return { ...state, showAbout: !state.showAbout };
    case "modal-settings-show-toggle":
      if (state.showSettings) {
        // refresh view when closing modal showSettings
        state.view = getView(state);
      }
      return { ...state, showSettings: !state.showSettings };
    case "toggle-theme":
      state.theme = state.theme == "light" ? "dark" : "light";
      return { ...state, theme: state.theme };
    case "sources-data-push":
      if (!state.sources) state.sources = [];
      state.sources?.push(...action.sourcesData || []);
      return { ...state, sources: state.sources };
    case "issues-data-load-start":
      return { ...state, issues: [], view: { columns: [] } };
    case "issues-data-push":
      if (!state.issues) state.issues = [];
      state.issues?.push(...action.issuesData || []);
      state.view = getView(state);
      return { ...state, issues: state.issues, view: state.view };
    case "issues-data-load-complete":
      return state;
    case "modal-settings-save-sources":
      localStorage.setItem(
        localStorageSourcesKey,
        JSON.stringify(action.sourcesData),
      );
      return {
        ...state,
        sources: action.sourcesData,
      };
    case "view-mode-columns":
      return { ...state, viewColumnsMode: action.viewModeCol || "label" };
    case "view-mode-rows":
      return { ...state, viewRowsMode: action.viewModeRow || "label" };
    default:
      throw new Error(`Unexpected action ${action.command}`);
  }
};

const AppDataLoader = () => {
  const [appSettings, appSettingsDispatch] = useReducer(
    AppSettingsReducer,
    appSettingsInitialState,
  );

  useEffect(() => {
    let localStorageFound = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes(localStorageSourcesKey)) {
        const stored = JSON.parse(localStorage.getItem(key)!);
        appSettingsDispatch({
          command: "modal-settings-save-sources",
          sourcesData: stored,
        });
        localStorageFound = true;
      }
    }
    if (!localStorageFound) {
      appSettingsDispatch({
        command: "modal-settings-save-sources",
        sourcesData: defaultSources,
      });
    }
  }, []);

  useEffect(() => {
    appSettingsDispatch({
      command: "issues-data-load-start",
    });
    const promises = (appSettings.sources || []).map((repo) => {
      return apiFetchRepoIssues(repo);
    });
    (async function () {
      const asyncFunctions = promises;
      for (const asyncFn of asyncFunctions) {
        const result = await asyncFn;
        appSettingsDispatch({
          command: "issues-data-push",
          issuesData: result,
        });
      }
      appSettingsDispatch({
        command: "issues-data-load-complete",
      });
    })();
  }, [appSettings.sources, appSettings.sources?.length]);

  return (
    <>
      <AppSimpleBoard
        boardState={appSettings}
        boardDispatch={appSettingsDispatch}
      />
    </>
  );
};

export default function SimpleBoardWrapped() {
  return <AppDataLoader />;
}
