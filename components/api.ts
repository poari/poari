import { IAppSettingsSource, Provider } from "./interfaces.ts";

const mapIssueGitea = (json: any, provider: string) => {
  // TODO: gitea mapping todo
  console.error("issue mapping gitea not ready", json, provider);
  throw new Error("issue mapping not ready");
};

const mapIssueGitLab = (json: any, provider: string) => {
  return json.map((data: any) => {
    data.assignees = data.assignees.map((a: any) => {
      return {
        login: a.username,
        id: a.id,
      };
    });
    data.labels = data.labels.map((l: any, index: number) => {
      return {
        name: l,
        color: "666666",
        description: l,
        id: index,
      };
    });
    data.state = data.state == "opened" ? "open" : data.state;
    data.number = data.id;
    data.html_url = data.web_url;
    data.provider = provider;
    return data;
  });
};

const mapIssueGitHub = (json: any, provider: string) => {
  return json.map((data: any) => {
    data.provider = provider;
    return data;
  });
};

const getRequestOptions = (source: IAppSettingsSource) => {
  if (source.apikey !== "") {
    return {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${source.apikey}`,
      },
    };
  }
  return {};
};

const getApiIssueRequestUrl = (source: IAppSettingsSource) => {
  let url = `https://api.github.com/repos/${source.url}/issues?state=all`;
  if (source.provider == Provider.gitea) {
    url = `${source.domain}/api/v1/repos/${source.url}/issues/`;
  } else if (source.provider == Provider.gitlab) {
    url = `${source.domain}/api/v4/projects/${source.url}/issues`;
  }
  return url;
};

export const apiFetchRepoIssues = async (source: IAppSettingsSource) => {
  if (!source.url || source.url.length < 3) {
    throw new Error("wrong source url");
  }

  const url = getApiIssueRequestUrl(source);
  const response = await fetch(url, getRequestOptions(source));

  if (response.ok) {
    let data;
    const json = await response.json();
    if (source.provider == Provider.gitea) {
      data = mapIssueGitea(json, source.name);
    } else if (source.provider == Provider.gitlab) {
      data = mapIssueGitLab(json, source.name);
    } else if (source.provider == Provider.github) {
      data = mapIssueGitHub(json, source.name);
    }
    return data;
  } else {
    throw new Error(
      `error fetching issues at ${url} for source '${source.name}' (${source.url} for provider: ${source.provider})`,
    );
  }
};
