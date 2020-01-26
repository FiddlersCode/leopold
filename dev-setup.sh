#cp .env-template .env

# install Circle CI CLI (required for pre-commit validation of CI files)
#curl -fLSs https://circle.ci/cli | bash

# https://docs.brew.sh/Taps
#brew tap mongodb/brew
brew install mongodb-community@4.2
brew services start mongodb-community@4.2
ps aux | grep -v grep | grep mongod
