# Leopold
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

-  Run the Docker stack: `docker-compose up`
   
   This runs the Mongo container as well as the Leopold app (defined in the Dockerfile)
   You can proceed with usual Docker commands, but using `balena` instead of `docker`
      e.g. `balena ps --format "{{.ID}}: {{.Names}}"`

### Dev Deployment:
#### Deploying to dev server
- Find the IP address of your dev Raspberry Pi using Balena's dashboard or CLI
- `balena push [YOUR IP ADDRESS]` 
   
   This pushes all your existing code, regardless of its git status. More info:
   https://www.balena.io/docs/learn/deploy/deployment/
 
#### ssh into dev server
- `balena ssh [YOUR IP ADDRESS]`  
   

### Proposed Technologies:
Monitoring: Prometheus

Database: MongoDB running on a Raspberry Pi with daily backups to the cloud using `mongodup`

CI/CD: Circle CI

Code: 
- Typescript
- Node
- Jest
- Open Api

Dev Server:
Raspberry Pi run with Balena in dev mode (can be same hardware as Mongo container?)

Prod Server:
Raspberry Pi run with Balena in prod mode (can be same hardware as Mongo container?)

# Contributing to Leopold
Contributions are very welcome to this repo! 
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)


Please take a moment to read the philosophy of development, as it might be a bit different to what you're used to doing.

### Philosophy:
This repo contains a significant amount of automated tooling from the commit stage forward.
It can feel like a real hassle at first, but it's designed to get your code up and running in front of
users as quickly and safely as possible. I suggest working in [pomodoros](https://francescocirillo.com/pages/pomodoro-technique)
and getting up and walking outside on the 5-minute breaks.

This repo is written with TDD - see more below and please continue to contribute with this practice!

### Automated Tooling
#### Setup
- You can run the `dev-setup.bash` script which will create a lot of your development environment.
Improvements to this script are https://github.com/FiddlersCode/leopold/issues/32
- When developing locally, use a feature branch with the format `issue-NN`, where the issue links to the relevant GitHub issue.
Commits should start with this issue number.

#### Commit Stage
When you attempt a commit, the following checks will be run:
- a script will check for the correct branch name and commit message format (see setup above) https://github.com/FiddlersCode/leopold/issues/34
- `eslint`: this will fix whatever errors `eslint` can automatically. 
An improvement to add the fixed files to staging and re-attempt the commit is here https://github.com/FiddlersCode/leopold/issues/7
- `npm run test`: this will run all tests using Jest. The commit will fail if any tests fail. You will need to fix the broken test(s) and re-commit.
Tip: use the bash command `history` to get the number of your previous commit, and re-run with `!`:
```$xslt
  history
  801  git commit -m 'issue-29: add more db queries, refactor the test code and fix the coverage tooling to check the correct dirs'
  !801
  git commit -m 'issue-29: add more db queries, refactor the test code and fix the coverage tooling to check the correct dirs'
```
- `npm run test` also runs Jest's coverage tool.
Your commit will fail if the coverage falls below the parameters defined in `jest.config.js`/

#### Push Stage
Further checks are run at this stage.
- `npm run healthcheck-ci`: this brings up the Docker stack locally and checks that it's running
- `npm run test-ci`: this runs all of the tests against the Docker stack 
(e.g. the Mongo tests which run against an in-memory database will now run against the Mongo container)

If all of these pass, your push will succeed. At this point, a build is kicked off in Circle CI.
Circle CI will run all of the checks at the commit stage.

#### GitHub Remote Configuration
The following checks are in place for the remote repo:
- protected branches cannot be deleted
- branches require a passing build on Circle CI to be merged
- branches do not currently require a PR approval. I am the sole contributor and GitHub does not allow users
to approve their own PRs so I would never be able to merge! 

#### Deploy Stage
If the build succeeds on Circle CI, your PR will be marked as "able to be merged".
https://github.com/FiddlersCode/leopold/issues/35

Upon merge, a build will be kicked off on Circle CI's `develop` branch. 
If the build passes, the code will be deployed to the production environment.
(As prod is currently a Raspberry Pi named Ginger Nuts sitting on my desk, this may involve a bit of service down time.
I'm the only user, so I'll be sure to alert myself to the outage.)

As soon as the build is completed on prod, a series of service health checks will be run
If these healthchecks fail, the merge will be immediately reverted.
https://github.com/FiddlersCode/leopold/issues/36

#### Further Plans
- Consider blue/green deployment with 2 Pis https://github.com/FiddlersCode/leopold/issues/37


### Architecture
![architecture diagram](./architecture/architecture.png)

