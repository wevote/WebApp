# README for Installation with Docker
[Back to root README](../../README.md)

Only [Docker Desktop](https://docs.docker.com/get-docker/) is required.

[WSL 2](https://learn.microsoft.com/en-us/windows/wsl/compare-versions#comparing-wsl-1-and-wsl-2) users should follow [this guide](https://docs.docker.com/desktop/wsl/) as well.

## Installation

### 1. Clone your WebApp fork (replace wevote with your github username)

  ```
  git clone https://github.com/wevote/WebApp.git
  cd WebApp
  ```

### 2. Create configuration by copying the default template

  ```
  cp src/js/config-template.js src/js/config.js
  ```
  If you are running your own API server (WeVoteServer) locally, change the new config file to point to your local API container (instead of the live API server):
  ```
  WE_VOTE_SERVER_ROOT_URL: 'http://localhost:8000/',
  WE_VOTE_SERVER_ADMIN_ROOT_URL: 'http://localhost:8000/admin/',
  WE_VOTE_SERVER_API_ROOT_URL: 'http://localhost:8000/apis/v1/',
  WE_VOTE_SERVER_API_CDN_ROOT_URL: 'http://localhost:8000/apis/v1/',
  ```

### 3. Create Docker network
We will run all WeVote docker containers in an isolated docker network. Since the backend (WeVoteServer) and frontend (WebApp) both use docker compose (which typically manages docker networks for us), we must manually create this shared network to avoid conflicts. Even if you are not planning on running your own backend, this step must still be completed.
```
docker network create wevote
```

### 4. Starting the container

To start the WeVote WebApp service, use one of these commands. You should already be running the WeVoteServer API service. If you are just getting started, we recommend using the first (foreground) method below. These commands assume you are in the `WebApp` folder created in Step 1 above.

#### 1. Start in the foreground (for debugging/logs):
```
docker compose up
```
This command builds, (re)creates, and starts the service, and shows the logs in your terminal. **Press `Ctrl+C` to stop the container gracefully.**
* Note: If this errors due to `npm ci`, reach out to Marcel Jacquot on Slack

#### 2. Start in the background (detached mode):
```
docker compose up -d
```
The `-d` (detached) flag runs the container in the background, leaving it running after you exit the terminal. Once started in detached state, use this command to stop the container:
```
docker compose down
```

Once the container is running, you can now access the WebApp at [http://localhost:3000/](http://localhost:3000/)

## Resources

1. Docker Compose
    
    - [CLI](https://docs.docker.com/compose/reference/)

    - [Networking](https://docs.docker.com/compose/networking/)

2. PostgreSQL

    - [Official Docker Image](https://hub.docker.com/_/postgres)

[Back to root README](../README.md)
