import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import {
  IAppColumnProps,
  IAppIssueProps,
  IAppModalProps,
  IAppNavBarProps,
  IAppRowProps,
  IAppSettingsProps,
  IAppSettingsRepoProps,
  IAppSettingsSource,
  Provider,
} from "./interfaces.ts";

export const locale = "it-IT";
export const appTitle = "poari";
export const appPayoff =
  "a minimal board view for issues across multiple projects";
export const appAboutRepoUrl = "https://github.com/poari/poari#readme";
export const appInfoGitLabIssueUrl = "https://gitlab.com/api/v4/groups/poari";
export const appVersion = "0.0.1";
export const appAboutText = "";

const appDefaultNewIssueProvider: IAppSettingsSource = {
  name: "new",
  url: "",
  apikey: "",
  domain: "",
  provider: Provider.github,
};

const appIssueColumnsModes = ["state", "milestone", "assignee", "label"];
const appIssueRowsModes = ["state", "milestone", "assignee", "label"];

export const AppColumn = (props: IAppColumnProps) => (
  <div class="section-row bg-white rounded px-2 p-1 rounded shadow-sm border-gray-100 border drop-col">
    <div class="flex flex-row justify-between items-center mb-2 mx-1">
      <div class="flex items-center">
        <h2 class="bg-gray-100 text-sm w-max px-1 rounded mr-2 text-gray-700">
          {props.colData.title || "empty"}
        </h2>
      </div>
    </div>
    {props.children}
  </div>
);

export const AppRow = (props: IAppRowProps) => (
  <div
    onDrop={(event) => props.onDrop(event)}
    onDragOver={(event) => props.onDragOver(event)}
    class="section-row border rounded mb-2 p-1 bg-gray-100"
  >
    <div>{props.rowData.title || `empty`}</div>
    <div>{props.children}</div>
  </div>
);

export const AppIssue = (props: IAppIssueProps) => {
  const formatDate = (date: string) => {
    if (!date || date.length < 8) return "";
    const _date = new Date(date);
    return `${_date.toLocaleDateString(locale)} ${
      _date.toLocaleTimeString(locale)
    }`;
  };

  const assignees = props.issueData.assignees || [];
  const singleFound = assignees.find((a) =>
    a.id === (props.issueData?.assignee?.id || "")
  );
  if (!singleFound && props.issueData?.assignee?.id) {
    assignees.push(props.issueData?.assignee);
  }

  return (
    <div
      class="bg-white p-2 mb-2 rounded shadow-sm border-gray-200 border-2 drag-card"
      draggable
      onDrag={(event) => props.onDrag(event)}
      onDrop={(event) => props.onDrop(event)}
      onDragOver={(event) => props.onDragOver(event)}
    >
      <h3 class="text-sm mb-1 text-gray-700">
        <a href={props.issueData.html_url} target="_blank">
          {props.issueData.title}
        </a>
      </h3>
      <h6 class="text-xs mb-2 text-gray-700">
        <a href={props.issueData.html_url} target="_blank">
          {`# ${props.issueData.number}`}
          {`- ${props.issueData.provider}`}
        </a>
      </h6>
      <div class="section-labels">
        {props.issueData.labels.map((
          label,
        ) => (
          <span
            class="text-xs w-max p-1 rounded mr-2 text-gray-700"
            style={`background-color: #${label.color}33`}
          >
            {label.name}
          </span>
        ))}
        {props.issueData.labels.length < 1 &&
          (
            <span class="bg-red-300 text-xs w-max p-1 rounded mr-2 text-gray-700">
              no label
            </span>
          )}
      </div>
      <div class="section-assignees flex flex-row items-center mt-2">
        {assignees.length > 0 &&
          assignees.map((assignee) => (
            <div class="flex flex-row mr-1">
              <div class="bg-green-300 rounded-full w-4 h-4 mr-1"></div>
              <div class="text-xs text-gray-500">{assignee.login}</div>
            </div>
          ))}
        {assignees.length < 1 &&
          (
            <div class="flex flex-row">
              <div class="bg-red-300 rounded-full w-4 h-4 mr-3"></div>
              <div class="text-xs text-gray-500">
                no assignee
              </div>
            </div>
          )}
      </div>
      <div class="flex flex-row mt-2">
        {props.issueData.state == "open" && (
          <div class="bg-green-300 w-4 h-4 mr-1"></div>
        )}
        {props.issueData.state == "closed" && (
          <div class="bg-blue-300 w-4 h-4 mr-1"></div>
        )}
        {props.issueData.state !== "closed" &&
          props.issueData.state !== "open" &&
          <div class="bg-gray-300 w-4 h-4 mr-1"></div>}
        <div class="text-xs text-gray-500">
          state: {props.issueData.state}
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        {formatDate(props.issueData.created_at)}
      </p>
      <p class="text-xs text-gray-500 mt-2">
        {props.issueData.milestone && (
          <div class="flex flex-row mr-1">
            <div class="bg-green-300 rounded w-4 h-4 mr-1"></div>
            <div class="text-xs text-gray-500">
              {props.issueData.milestone.title}
            </div>
          </div>
        )}
        {!props.issueData.milestone && (
          <div class="flex flex-row mr-1">
            <div class="bg-red-300 rounded w-4 h-4 mr-1"></div>
            <div class="text-xs text-gray-500">no milestone</div>
          </div>
        )}
      </p>
    </div>
  );
};

const AppSettingsRepo = (props: IAppSettingsRepoProps) => {
  let {
    domain,
    name,
    url,
    apikey,
    provider,
    emitSaveSource,
    emitRemoveSource,
  } = props;
  const [edit, setEdit] = useState(false);
  const clickEdit = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(true);
  };
  const clickSave = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = {
      domain: domain,
      name: name,
      url: url,
      apikey: apikey,
      provider: provider,
    };
    emitSaveSource(data);
    setEdit(false);
  };
  const clickRemove = (e: any) => {
    e.preventDefault();
    emitRemoveSource();
  };
  const setProvider = (providerString: string) => {
    provider = Provider[providerString as keyof typeof Provider];
  };

  return (
    <div>
      {edit && (
        <>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="provider"
            >
              provider
            </label>
            <select
              class="form-select appearance-none
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-red-300 focus:outline-none"
              onChange={(event) => setProvider(event.currentTarget.value)}
            >
              {Object.values(Provider).map((p) => (
                <option value={p} selected={p == provider}>{p}</option>
              ))}
            </select>
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="name"
            >
              domain (ignored for github)
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="url"
              type="text"
              placeholder="name"
              value={domain}
              onChange={(event) => domain = event.currentTarget.value || ""}
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="name"
            >
              name ({name})
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="url"
              type="text"
              placeholder="name"
              value={name}
              onChange={(event) => name = event.currentTarget.value || ""}
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="url"
            >
              url
              {provider == "github" &&
                <div>for github enter organization/repository</div>}
              {provider == "gitlab" &&
                (
                  <div>
                    for gitlab enter issue project id{" "}
                    <a href={appInfoGitLabIssueUrl}>*</a>
                  </div>
                )}
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="url"
              type="text"
              placeholder="organization/repository"
              onChange={(event) => url = event.currentTarget.value || ""}
              value={url}
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="apikey"
            >
              apikey (if necessary)
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="apikey"
              type="text"
              placeholder=""
              onChange={(event) => apikey = event.currentTarget.value || ""}
              value={apikey}
            />
          </div>
          <div>
            <button onClick={(e) => clickSave(e)}>save</button>
          </div>
        </>
      )}
      {!edit && (
        <>
          <div class="border rounded mb-2 flex flex-row justify-between p-2">
            <span>{name} {provider}</span>
            <span>
              <button
                class="mt-1 mb-1 p-1 w-20 text-white bg-red-300 rounded-md outline-none ring-offset-2 ring-red-300 hover:ring-2 focus:ring-2"
                onClick={(e) => clickEdit(e)}
              >
                edit
              </button>{"  "}
              <button
                class="mt-1 mb-1 p-1 w-20 text-white bg-red-300 rounded-md outline-none ring-offset-2 ring-red-300 hover:ring-2 focus:ring-2"
                onClick={(e) => clickRemove(e)}
              >
                remove
              </button>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export const AppSettings = (props: IAppSettingsProps) => {
  const {
    sources,
    columnsMode,
    rowsMode,
    onEditSources,
    onEditColumnsMode,
    onEditRowsMode,
  } = props;
  const onSaveRepo = (editRepo: any, index: number) => {
    sources[index] = editRepo;
    onEditSources(sources);
  };
  const onRemoveRepo = (repo: IAppSettingsSource) => {
    const filtered = sources.filter((source) => {
      return source != repo;
    });
    onEditSources(filtered);
  };
  const clickAddRepo = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sources.push(appDefaultNewIssueProvider);
    onEditSources(sources);
  };
  const setColumnsMode = (value: string) => {
    onEditColumnsMode(value);
  };
  const setRowsMode = (value: string) => {
    onEditRowsMode(value);
  };

  return (
    <div class="w-full">
      <form class="bg-white shadow-md rounded px-2 pt-2 pb-2 mb-2">
        <div class="grid grid-cols-4 gap-5 p-2 ml-2 mr-2">
          <div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="columns"
              >
                columns
              </label>
              <select
                class="form-select appearance-none
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-red-300 focus:outline-none"
                onChange={(event) =>
                  setColumnsMode(event.currentTarget.value || "")}
              >
                {appIssueColumnsModes.map((p) => (
                  <option value={p} selected={p == columnsMode}>{p}</option>
                ))}
              </select>
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="rows"
              >
                rows
              </label>
              <select
                class="form-select appearance-none
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-red-300 focus:outline-none"
                onChange={(event) =>
                  setRowsMode(event.currentTarget.value || "")}
              >
                {appIssueRowsModes.map((p) => (
                  <option value={p} selected={p == rowsMode}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div class="col-span-3">
            <h1 class="block text-gray-700 text-sm font-bold mb-2">
              sources for issues
            </h1>
            <div class="overflow-scroll lg:min-h-[20rem] md:min-h-[15rem] sm:min-h-[10rem]">
              {sources &&
                sources.map((repo, index) => (
                  <AppSettingsRepo
                    key={index}
                    domain={repo.domain || ""}
                    name={repo.name}
                    url={repo.url}
                    apikey={repo.apikey}
                    provider={repo.provider}
                    index={index}
                    edit={false}
                    emitSaveSource={(e: any) => onSaveRepo(e, index)}
                    emitRemoveSource={(e: any) => onRemoveRepo(repo)}
                  >
                  </AppSettingsRepo>
                ))}
            </div>
            <div class="items-center justify-between">
              <button
                class="mt-3 p-2.5 text-white bg-red-300 rounded-md outline-none ring-offset-2 ring-red-300 hover:ring-2 focus:ring-2"
                type="button"
                onClick={(e) => clickAddRepo(e)}
              >
                add source
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const AppNavBar = (props: IAppNavBarProps) => {
  const { showSettings, showAbout } = props;
  const showSettingsFix = (event: any) => {
    event.preventDefault();
    showSettings();
  };
  const showAboutFix = (event: any) => {
    event.preventDefault();
    showAbout();
  };
  return (
    <div class="bg-gray-100">
      <nav class="bg-white px-6 relative shadow-md">
        <div class="flex flex-row justify-between items-center py-2">
          <div class="container-fluid">
            <a
              class="flex items-center text-red-300 mt-0 lg:mt-0 mr-1"
              href="/"
              onClick={(event) => event.preventDefault()}
            >
              <img
                class="mr-2"
                src="icon.png"
                style="height: 25px"
                alt="logo"
                loading="lazy"
              />
              <span class="font-medium mr-1">{appTitle}</span>
              <span class="font-small text-red-300 hidden md:block">
                {appPayoff}
              </span>
            </a>
          </div>
          <div class="group flex flex-col items-center">
            <button
              class="p-2 rounded-lg md:hidden"
              onClick={(event) => event.preventDefault()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="h-10 fill-current"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
            </button>
            <div class="hidden group-hover:block md:block absolute md:static bg-white inset-x-0 top-16 py-3 shadow-md md:shadow-none text-gray-600">
              <div class="flex flex-row justify-end issues-end text-right font-semibold text-gray-500">
                <a
                  class="px-6 py-1 flex flex-col md:flex-row md:items-center"
                  href="/#/settings"
                  onClick={(event) => showSettingsFix(event)}
                >
                  Settings
                </a>
                <a
                  class="px-6 py-1 flex flex-col md:flex-row md:items-center"
                  href="/#/about"
                  onClick={(event) => showAboutFix(event)}
                >
                  About
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export const AppModal = (props: IAppModalProps) => {
  const { showModal, setShowModal, title } = props;
  let modalClasses =
    "relative w-full p-4 mx-auto bg-white rounded-md shadow-lg";
  if (!props.fullWidth) {
    modalClasses += " max-w-lg";
  } else {
    modalClasses += " max-w-5xl";
  }
  return (
    <>
      {showModal
        ? (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => setShowModal(false)}
              >
              </div>
              <div className="flex items-center px-4 py-8">
                <div className={modalClasses}>
                  <div className="mt-3 sm:flex">
                    <div className="mt-2 text-center w-full">
                      <h4 className="text-lg font-medium text-gray-800">
                        {title}
                      </h4>
                      <div className="mt-2 text-[15px] leading-relaxed text-gray-500">
                        {props.children}
                      </div>
                      <div className="text-center">
                        <button
                          className="w-40 mt-3 p-2.5 text-white bg-red-300 rounded-md outline-none ring-offset-2 ring-red-300 hover:ring-2 focus:ring-2"
                          onClick={() => setShowModal(false)}
                        >
                          close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
        : null}
    </>
  );
};
