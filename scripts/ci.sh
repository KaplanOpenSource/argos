#!/bin/bash

cd ~/argos
# Check new version exists
git fetch && if [ "$1" = "--force" ] || [ `git rev-parse HEAD` != `git rev-parse origin/HEAD` ]; then
  # kill previous server instance if running
  server_pid=$(ps ax | grep 'python -um server' | grep -v grep | awk '{print $1;}')
  echo $server_pid
  if [ -n "$server_pid" ]; then
      kill -9 $server_pid
      sleep 1
      ps ax | grep 'python -um server' | grep -v grep
  fi

	git reset --hard origin/HEAD;

  # Build react client side
	cd client
	npm install &&
	npm run build &&
	git rev-parse HEAD > dist/commit.txt &&
	cd -

  # Build python requirements for server
  if [ ! -d ".venv" ]; then
    python -m venv .venv
  fi
	source .venv/bin/activate # . is a synonym to source
	pip install -r requirements.txt
  python --version

  # run detached server with output to nohup.out file
  nohup python -um server --prod --port=8080 2>&1 > nohup.out &
fi
