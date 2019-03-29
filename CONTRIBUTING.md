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

## Publish a new version

```bash
# In root directory
# Analyze git history, create git tag and update upstream
yarn lerna version --conventional-commits
# Publish to npm
yarn lerna publish from-git
```
