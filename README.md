# ARGOS
Device placement web app

## Development
### Setup
After cloning this repo, in its folder execute these commands:
```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd client
npm install
cd ..
```

### Run production environment locally
```
cd client && npm run build && cd .. && source .venv/bin/activate && python -m server
```
click the link shown on the terminal, usually http://127.0.0.1:8080

### Run development environment
1. Open one terminal and run:
```
source .venv/bin/activate && python -m server
```
2. Open another terminal and run:
```
cd client && npm run dev
```
3. click the link shown on the second terminal, usually http://localhost:5173/

## Deployment to server
### Do these only once:
1. Open ssh connection to server
```
sudo apt install nodejs python3-venv python3-pip zip unzip
mkdir argos && cd argos
python3 -m venv .venv
```
2. exit ssh.  
3. make sure the address written inside `scripts/deploy.sh` is correct.  

### Do this whenever you want to update the server
4. run on project folder:
```
sh scripts/deploy.sh
```