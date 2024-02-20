ls

# kill previous server instance if running
server_pid=$(ps ax | grep 'python -um server' | grep -v grep | awk '{print $1;}')
echo $server_pid
if [ -n "$server_pid" ]; then
    kill -9 $server_pid
    sleep 1
    ps ax | grep 'python -um server' | grep -v grep
fi

# install python requirements for server
source .venv/bin/activate
python --version
pip install -r requirements.txt

# run detached server with output to nohup.out file
nohup python -um server --prod --port=8080 2>&1 > nohup.out &
