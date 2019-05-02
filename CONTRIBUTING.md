# Contributing to Saber

## Set up Saber locally

Fork this project, then:

```bash
git clone git@github.com:$USER/saber.git
cd saber

# Install dependencies
yarn

# Link the `saber` binary
cd packages/saber
yarn link

# If you wanna run the website locally
cd website
yarn
yarn dev # which uses the global `saber` command
```

## Pull Requests

Before starting to work on an issue, first ensure there are no open PRs for it already, then comment that you intend to work on it, to prevent others from wasting their time doing the same work.

If the issue you're working on is funded by IssueHunt, you also need to submit the PR URL to IssueHunt after submitting your PR on GitHub.

## Publish a new version

If you have write access to this project:

```bash
# In root directory
# Analyze git history, create git tag and update upstream
yarn lerna version --conventional-commits
# Publish to npm
yarn lerna publish from-git
```
