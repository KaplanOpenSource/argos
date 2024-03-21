echo $'\ncreate deploy archive from git\n====='
rm argos.zip
git archive --format=zip -o argos.zip HEAD

echo $'\nbuild client\n====='
cd client/
npm install
npm run build
cd -
git rev-parse HEAD > client/dist/commit.txt

echo $'\nadd client to deploy archive\n====='
zip -ur argos.zip client/dist/

echo $'\ncopy deploy archive to server\n====='
scp argos.zip eran@3.249.107.168:~/

echo $'\ndeploy and restart server\n====='
ssh eran@3.249.107.168 'mkdir -p argos && cd argos && unzip -o ../argos.zip && bash scripts/run.sh'
