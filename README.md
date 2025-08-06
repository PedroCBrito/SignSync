# SignSync

<p align="center">
  <img src="public/assets/icons/logo_SignSync.png" alt="SignSync" width="200" />
</p>


## Running this extension

1. Clone this repository
2. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
3. Pin the extension from the extension menu
4. Navigate to the webpage you want to record
5. Click the extension icon to open the control panel
6. Click the start recording button to begin recording
7. Click the stop recording button to end recording and download the file



## Running Backend
1. Follow the following commands
```
cd SignSync-Backend
cd speech-backend
npm install
docker-compose up --build
```
2. Open the browser and test the extension
3. For error will be reflected in the console

<span style="font-size:small;">
  OR you can create your own server in Cloud Run, but need to use your own API keys.
  
  To make this need to run the instructions in: SignSync-Backend\speech-backend\README.md
</span>



## Running Unity
<span style="color:red; font-size:small;">
  Obs. The new version uses the online unity server, so it's not necessary to create the docker.
</span>

1. Follow the following commands
```
cd unity
docker-compose up --build
```
2. Open the browser and test the extension
3. For error will be reflected in the console