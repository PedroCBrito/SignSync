### 1 - Instructions to update the cloud run server
```
rem --- Variáveis de Configuração para Windows CMD ---
set PROJECT_ID=signsync-459720
set REGION=southamerica-east1
set REPO_NAME=signsync-repo1
set IMAGE_NAME=tradutor-glosa1

rem --- Comandos (pode pedir para confirmar a criação do repositório) ---
gcloud artifacts repositories create %REPO_NAME% --repository-format=docker --location=%REGION% --description="Repositório para a aplicação SignSync"

rem --- Comando para construir a imagem ---
docker build -t %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPO_NAME%/%IMAGE_NAME%:latest .

rem --- Comando para enviar a imagem ---
docker push %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPO_NAME%/%IMAGE_NAME%:latest
```

### 2 - Deploy the changes
```
gcloud run deploy tradutor-glosa-service --image=%REGION%-docker.pkg.dev/%PROJECT_ID%/%REPO_NAME%/%IMAGE_NAME%:latest --platform=managed --region=%REGION% --port=3000 --allow-unauthenticated --session-affinity --set-env-vars="SUA_CHAVE_API_GEMINI=SUA_NOVA_CHAVE_SECRETA_AQUI"
```