# ARGOS
Device placement web app

### Setup
After cloning this repo, in its folder execute these commands:
```
python -m venv .env
source .env/bin/activate
pip install -r requirements.txt
cd client
npm install
cd ..
```

### Run production environment locally
```
cd client && npm run build && cd .. && source .env/bin/activate && python -m server
```
click the link shown on the terminal, usually http://127.0.0.1:8080

### Run development environment
Open one terminal and run:
```
source .env/bin/activate && python -m server
```
Open another terminal and run:
```
cd client && npm run dev
```
click the link shown on the second terminal, usually http://localhost:5173/
