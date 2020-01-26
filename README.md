# Leopold
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A virtual agent for my violin playing!

This project will answer the following questions:

- Where and when should I be playing the violin?
- Have I been paid for playing the violin?

### Security
Monitored with Snyk
[![Known Vulnerabilities](https://snyk.io/test/github/FiddlersCode/leopold/badge.svg?targetFile=package.json)](https://snyk.io/test/github/FiddlersCode/leopold?targetFile=package.json)
Snyk continuously scans the GitHub repo for vulnerabilities and upgrades, and automatically generates
a pull request when an upgrade is found (see https://github.com/FiddlersCode/leopold/pull/53).

### Local Dev:
`npm run dev` will run the code locally.

Currently broken due to Mongo Docker issue: https://github.com/FiddlersCode/leopold/issues/65

### Commit/Push/Merge/Deploying
See info below under contributing.

## Contributing to Leopold
Contributions are very welcome to this repo! 
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)
In making a contribution, you agree to abide by the Code of Conduct (./CODE_OF_CONDUCT.md) 

Please take a moment to read the philosophy of development, as it might be a bit different to what you're used to doing.

### Philosophy:
This repo contains a significant amount of automated tooling from the commit stage forward.
It can feel like a hassle at first, but it's designed to get your code up and running in front of
users as quickly and safely as possible. I suggest working in [pomodoros](https://francescocirillo.com/pages/pomodoro-technique)
and getting up and walking outside on the 5-minute breaks.

This repo is written with TDD - see more below and please continue to contribute with this practice!

### Automated Tooling
#### Setup
- You can run the `dev-setup.sh` script which will create your development environment.

   - Copies the .env template file
   - Installs the [Circle CI CLI](https://circleci.com/docs/2.0/local-cli/) (required for pre-commit checks) 
Improvements to this script are https://github.com/FiddlersCode/leopold/issues/32
- When developing locally, use a feature branch with the format `issue-NN`, where the issue links to the relevant GitHub issue.

Alternatively, you can run these steps manually. (They have only been tested on a Mac so Windows users may experience issues with the script.)

#### Troubleshooting
- Mongo connection errors? `brew services restart mongodb-community`

#### Commit Stage
Commits can be made using `git commit` or `git commit -m`. 
We recommend `git commit` as there will be an interactive shell to enforce commit message style
so your message passed with the `-m` flag will be lost.

When you attempt a commit, the following checks will be run:
- `npm run ci-validate`: this validates the `.circleci/config.yml` file
- `npm run lint-dev`: this will run `eslint` and automatically fix whatever errors it can (NB you will still need to commit any changed files). 
- `npm run test`: this will run all tests using Jest. The commit will fail if any tests fail. You will need to fix the broken test(s) and re-commit.
- `npm run test` also runs Jest's coverage tool.
Your commit will fail if the coverage falls below the parameters defined in `jest.config.js`

Not yet implemented:
 - a script will check for the correct branch name and commit message format (see setup above) https://github.com/FiddlersCode/leopold/issues/34
- An improvement to add the `linted` files to staging and re-attempt the commit is here https://github.com/FiddlersCode/leopold/issues/7

#### Commit Message
After the pre-flight checks have been run, an interactive dialogue will appear for you to formulate a commit message.
(NB: You may wish to change your default git editor: https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration 
or else remember `:q!` to quite Vim without saving the file.)
https://github.com/FiddlersCode/leopold/issues/47

Not yet implemented:
- automatic generation of semantic version numbers and changelogs based on your commit messages (hence the enforced style)

#### Push Stage
At the moment, no further checks are run at this stage.

Possible checks to be run in the future:
- `npm run healthcheck-ci`: this brings up the Docker stack locally and checks that it's running
- `npm run test-ci`: this runs all of the tests against the Docker stack 
(e.g. the Mongo tests which run against an in-memory database will now run against the Mongo container to check networking)

#### CI/CD Stage
Once all the local checks have passed and you have pushed to the remote repo, a branch build is kicked off in Circle CI.
Circle CI will run all of the checks at the commit stage. 

While the build is running on Circle CI, Snyk is also running a security monitor on the code on GitHub.

In order for a PR to be marked as "able to be merged", the following must be true:
- `Snyk` security scan has come back clean
- Branch build has succeeded on Circle CI.

Upon merge, a build will be kicked off on Circle CI's `develop` branch. 
If the build passes, the build Docker image will be tagged and pushed to Docker hub.
(Currently builds are tagged as "latest" but need to implement automatic semver 
to tag them correctly https://github.com/FiddlersCode/leopold/issues/47).

The image is then available to download to any servers that require an update.

#### GitHub Remote Configuration
The following checks are in place for the remote repo:
- protected branches cannot be deleted
- branches do not currently require a PR approval. I am the sole contributor and GitHub does not allow users
to approve their own PRs so I would never be able to merge! 


### Production server provisioning
The production server is a Raspberry Pi named Ginger Nuts sitting on my desk which is having issues connecting to the WiFi.
Once those have been resolved, the following ticket to implement a pull strategy
for the Pi will be done: https://github.com/FiddlersCode/leopold/issues/64

Following issue 64, as soon as the build is completed on the production server, a series of service health checks will be run
If these healthchecks fail, the merge will be immediately reverted.
https://github.com/FiddlersCode/leopold/issues/36

#### Further Plans
- Consider blue/green deployment with 2 Pis https://github.com/FiddlersCode/leopold/issues/37


### Architecture
![architecture diagram](./architecture/architecture.png)

