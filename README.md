# TLDRover
🚧 Under Construction 🚧

Currently reimplementing https://github.com/JeffC25/smart-article-analyzer-old

## Demo
![demo](https://github.com/JeffC25/tldrover/assets/34695547/de94b4f7-0fac-4dc5-acc5-baaa8367a933)

## Local Deveopment
To run and develop this project locally, clone the repository and ensure that Node.js and Python are installed.

To run the frontend: 
1. navigate to `/ui/`
2. run `npm install` to install dependencies
3. run `npm run dev` to start the development server

To run the backend: 
1. navigate to `/server/`
2. activate a Python virtual enviornment (optional)
3. run `pip install -r requirements.txt` to install dependencies
4. run `uvicorn app.main:app --reload` to start the development server

## API
The OpenAPI document for the server is available [here](https://github.com/JeffC25/tldrover/blob/main/oapi/openapi.yaml)
