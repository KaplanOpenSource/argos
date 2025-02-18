cd "$(dirname "$0")"
echo "getIcons executed from: ${PWD}"
npm install && node get_icons.js
