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

If you have write access to this repository, this is how you can create a new release.

### 1. Deciding on Which Channel to Release

Take a moment to think about the where you want to create a release:

**Canary channel**: This is the channel on which every commit and PR should land first. No matter how urgent it is to ship the commit to our users, it has to land here. It is used for testing and making sure everything is working as expected before shipping it to the stable channel.

**Stable channel**: This is the golden master. On this channel, only commits that have been tested on the canary channel for some time can be released. All users will receive releases created on this channel.

### 2. Switching to the Branch of Your Choice

Depending on the channel you have picked earlier, you now need to switch your local Git repository to one of the following branches:

- `canary` for releases on the canary channel
- `master` for releases on the stable channel

### 3. Deciding Whether to Move Commits

If you are about to do a release on the stable channel, make sure to use `git cherry-pick` (not `git merge`, because that will include the release commits) to move over commits from the `canary` to the `master` branch.

### 4. Creating the Release

As the next step, you need to run release. It is used to automatically create a release commit, tag and update `CHANGELOG.md` for you.

- Stable release: Run `yarn release-stable` on the `master` branch.
- Canary release: Run `yarn release-canary` on the `canary` branch.

After creating a release, run `yarn lerna publish from-git` to publish it on npm.

Automatically generated `CHANGELOG.md` is great, but it's not very user-friendly. After publishing, create a GitHub Release with the same text as the changelog entry. See previous Releases for inspiration.
