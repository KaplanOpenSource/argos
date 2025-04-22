cd "$(dirname "$0")" && cd ..
echo "Deploy script. executed from: ${PWD}"

echo $'\ncreate deploy archive from git\n====='
rm argos.zip
git archive --format=zip -o argos.zip HEAD

echo $'\nbuild client\n====='
cd client/
npm install
npm run build
if [ $? -ne 0 ]; then
  echo "Build failed, stopping script"
  exit 1
fi
cd -
git rev-parse HEAD > client/dist/commit.txt

echo $'\nadd client to deploy archive\n====='
zip -ur argos.zip client/dist/

echo $'\ncopy deploy archive to server\n====='
scp argos.zip eran@argos.kaplanopensource.co.il:~/

echo $'\ndeploy and restart server\n====='
ssh eran@argos.kaplanopensource.co.il 'mkdir -p argos && cd argos && unzip -o ../argos.zip && bash scripts/run.sh'
