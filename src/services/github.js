import { Octokit } from '@octokit/rest';
import { decode } from 'base-64';

class GitHubService {
  constructor() {
    this.octokit = new Octokit();
  }

  async getRepoFiles(owner, repo, path = '') {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error('Error fetching repo files:', error);
      throw error;
    }
  }

  async getFileContent(owner, repo, path) {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(response.data)) {
        throw new Error('Path points to a directory, not a file');
      }

      return decode(response.data.content);
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw error;
    }
  }

  async getAllFiles(owner, repo, path = '') {
    const files = [];
    const stack = [{ path }];

    while (stack.length > 0) {
      const current = stack.pop();
      const contents = await this.getRepoFiles(owner, repo, current.path);

      for (const item of contents) {
        if (item.type === 'file' && item.name.endsWith('.js')) {
          files.push({
            path: item.path,
            content: await this.getFileContent(owner, repo, item.path),
          });
        } else if (item.type === 'dir') {
          stack.push({ path: item.path });
        }
      }
    }

    return files;
  }

  parseGitHubUrl(url) {
    try {
      const parsedUrl = new URL(url);
      const [, owner, repo] = parsedUrl.pathname.split('/');
      return { owner, repo };
    } catch (error) {
      throw new Error('Invalid GitHub repository URL');
    }
  }
}

export const githubService = new GitHubService();
