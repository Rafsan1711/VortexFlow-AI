import { GitHubRepo, GitHubTreeItem } from '../types/editor';

const GITHUB_API = 'https://api.github.com';

// Helper to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `GitHub API Error: ${response.statusText}`);
  }
  return response.json();
};

// Get user's repos (first 30, sorted by updated)
export async function getUserRepos(token: string): Promise<GitHubRepo[]> {
  const response = await fetch(`${GITHUB_API}/user/repos?sort=updated&per_page=30`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  return handleResponse(response);
}

// Get repo file tree (recursive to get all files)
export async function getRepoTree(token: string, owner: string, repo: string): Promise<GitHubTreeItem[]> {
  // First get the default branch
  const repoInfo = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);
  
  const defaultBranch = repoInfo.default_branch;

  // Get the tree recursively
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  
  const data = await handleResponse(response);
  return data.tree;
}

// Get file content from repo
export async function getFileContent(token: string, owner: string, repo: string, path: string): Promise<string> {
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  
  const data = await handleResponse(response);
  // Content is base64 encoded
  return atob(data.content.replace(/\n/g, ''));
}

// Create new repo
export async function createRepo(token: string, name: string, description: string, isPrivate: boolean): Promise<GitHubRepo> {
  const response = await fetch(`${GITHUB_API}/user/repos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: true, // Initialize with README
    }),
  });
  
  return handleResponse(response);
}

// Get file SHA (needed for update)
export async function getFileSHA(token: string, owner: string, repo: string, path: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    
    if (response.status === 404) return null;
    
    const data = await handleResponse(response);
    return data.sha;
  } catch (error) {
    return null;
  }
}

// Commit file (create or update)
export async function commitFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,     // raw string content
  message: string,
  sha?: string         // required for update, omit for create
): Promise<void> {
  // Convert content to base64
  const contentBase64 = btoa(unescape(encodeURIComponent(content)));
  
  const body: any = {
    message,
    content: contentBase64,
  };
  
  if (sha) {
    body.sha = sha;
  }
  
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  await handleResponse(response);
}

// Batch commit multiple files (using simple loop for now, Git Data API is complex for this)
// Note: Real batch commits require creating blobs, trees, and commits. 
// For simplicity in this milestone, we'll iterate.
export async function commitMultipleFiles(
  token: string,
  owner: string,
  repo: string,
  files: Array<{ path: string; content: string; sha?: string }>,
  message: string
): Promise<void> {
  for (const file of files) {
    // Check for existing SHA if not provided
    let sha = file.sha;
    if (!sha) {
      sha = await getFileSHA(token, owner, repo, file.path) || undefined;
    }
    
    await commitFile(token, owner, repo, file.path, file.content, message, sha);
  }
}
