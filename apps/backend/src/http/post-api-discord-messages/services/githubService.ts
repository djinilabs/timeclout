import { Octokit } from "@octokit/rest";

/**
 * GitHub API service for fetching PR details (read-only)
 */

export interface PRDetails {
  number: number;
  title: string;
  body: string | null;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  author: {
    login: string;
    type: string;
  } | null;
  state: string;
  html_url: string;
  repository: {
    owner: string;
    name: string;
    full_name: string;
  };
}

/**
 * Initialize GitHub client
 */
function getGitHubClient(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  return new Octokit({
    auth: token,
  });
}

/**
 * Fetch PR details from GitHub
 */
export async function fetchPRDetails(
  owner: string,
  repo: string,
  prNumber: number
): Promise<PRDetails | null> {
  try {
    const octokit = getGitHubClient();

    const { data } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      head: {
        ref: data.head.ref,
        sha: data.head.sha,
      },
      base: {
        ref: data.base.ref,
      },
      author: data.user
        ? {
            login: data.user.login,
            type: data.user.type || "User",
          }
        : null,
      state: data.state,
      html_url: data.html_url,
      repository: {
        owner: data.head.repo?.owner?.login || owner,
        name: data.head.repo?.name || repo,
        full_name: `${data.head.repo?.owner?.login || owner}/${
          data.head.repo?.name || repo
        }`,
      },
    };
  } catch (error) {
    console.error(`Error fetching PR #${prNumber} from ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Check if PR is from Renovate bot
 */
export function isRenovatePR(author: PRDetails["author"]): boolean {
  if (!author) return false;
  const login = author.login.toLowerCase();
  return (
    login.includes("renovate") ||
    login === "renovate[bot]" ||
    author.type === "Bot" ||
    login.startsWith("app/")
  );
}

/**
 * Check if PR author is exactly app/renovate
 */
export function isAppRenovatePR(author: PRDetails["author"]): boolean {
  if (!author) return false;
  return author.login === "app/renovate";
}

/**
 * Check if there are any commits from other authors on the PR branch
 * Returns true if only the PR author (or app/renovate) has commits, false otherwise
 */
export async function hasOnlyRenovateCommits(
  owner: string,
  repo: string,
  branchName: string,
  prAuthor: string
): Promise<boolean> {
  try {
    const octokit = getGitHubClient();

    // Get commits on the branch
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: branchName,
      per_page: 100, // Check up to 100 commits
    });

    // Check if all commits are from the PR author (app/renovate)
    for (const commit of commits) {
      const commitAuthor = commit.author?.login || commit.commit.author?.name;
      // Skip if commit author is the PR author or app/renovate
      if (commitAuthor === prAuthor || commitAuthor === "app/renovate") {
        continue;
      }
      // If we find a commit from someone else, return false
      console.log(
        `Found commit from different author: ${commitAuthor} (PR author: ${prAuthor})`
      );
      return false;
    }

    // All commits are from the PR author
    return true;
  } catch (error) {
    console.error(
      `Error checking commits for branch ${branchName} in ${owner}/${repo}:`,
      error
    );
    // On error, be conservative and return false
    return false;
  }
}

/**
 * Parse repository string (owner/repo) into owner and repo
 */
export function parseRepository(repoString: string): {
  owner: string;
  repo: string;
} | null {
  const parts = repoString.split("/");
  if (parts.length !== 2) {
    return null;
  }
  return {
    owner: parts[0],
    repo: parts[1],
  };
}
