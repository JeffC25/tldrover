# 🚧 Under Construction 🚧 #
# TLDRover #

This project is a rewrite of https://github.com/JeffC25/smart-article-analyzer-old.

## Demo
![demo](https://github.com/JeffC25/tldrover/assets/34695547/de94b4f7-0fac-4dc5-acc5-baaa8367a933)

## Local Deveopment
To run and develop this project locally, clone the repository and ensure that Node.js and Python are installed.

#### To run the frontend: 
1. Navigate to `ui/`.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

#### To Run the backend:
~~1. Navigate to `server/`.~~
~~2. Run `bash install.sh` or `./install.sh` to set up a Python virtual enviornment and install dependencies.~~
~~3. Run `bash run-server.sh` or `./run-server.sh` to activate the virtual enviornment and start the development server.~~

  ~~or:~~

~~1. Navigate to `server/`.~~
~~2. Activate a Python virtual enviornment (optional).~~
~~3. Run `pip install -r requirements.txt` to install dependencies.~~
~~4. Run `uvicorn app.main:app --reload` to start the development server.~~
~~5. To deactivate the virtual enviornment the virtual enviornment, run `deactivate`.~~

## API

### Text Analyzer
The OpenAPI document for the text analysis server is available [here](https://github.com/JeffC25/tldrover/blob/main/oapi/analyzer.yaml).

### Text Extractor
The OpenAPI document for the text extraction server is available [here](https://github.com/JeffC25/tldrover/blob/main/oapi/extractor.yaml).

### Newsfeed Ingester
The OpenAPI document for the newsfeed server is available [here](https://github.com/JeffC25/tldrover/blob/main/oapi/news.yaml).
