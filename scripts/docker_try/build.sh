#!/bin/bash

# Clone or update repo
if [ -d "argos" ]; then
    (cd argos && git fetch origin && git reset --hard origin/main) || exit 1
else
    git clone https://github.com/KaplanOpenSource/argos || exit 1
fi
cd argos

# Build react client side
docker run --rm -it -v "$(pwd):/app" -w /app node:22-alpine sh -c 'cd client && npm install && npm run build -- --outDir=dist2' || exit 1
mkdir -p client/dist
cp -rf client/dist2/* client/dist # because dist was create as root

# Build python requirements for server
if [ ! -d ".venv" ]; then
  python -m venv .venv
fi
source .venv/bin/activate
python --version
pip install -r requirements.txt

# Mark current commit
git rev-parse HEAD > client/dist/commit.txt

echo Build done.

