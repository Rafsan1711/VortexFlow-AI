export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;      // "owner/repo"
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  private: boolean;
  html_url: string;
  updated_at: string;
  language: string | null;
  default_branch: string;
}

export interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree';  // file | folder
  sha: string;
  size?: number;
}

export interface EditorFile {
  id: string;
  name: string;
  content: string;
  language: string;
  isUnsaved?: boolean;
  updatedAt?: number;
  githubPath?: string;    // path in GitHub repo
  githubSha?: string;     // for update commits
}

export interface EditorProject {
  id: string;
  name: string;
  description?: string;
  files: Record<string, EditorFile>;
  githubRepo?: string;    // "owner/repo" format
  githubBranch?: string;
  createdAt?: number;
  updatedAt?: number;
  language?: string;
}

export interface EditorTab {
  id: string;
  fileId: string;
}
