# Starting the server
- Clone the repository
- run 
  ```bash
  yarn install
  ```
- Run the following
  ```bash
  touch .env
  ```
- Open the `.env` file to enter the port and host
- Run locally
  ```bash
  yarn serve
  ```
- For contribution
  ```bash
  git checkout -b dev
  yarn format
  yarn serve
  ```
- Push the code after contribution
  ```bash
  yarn format
  yarn start
  git add .
  git commit -m "new changes"
  git push
  ```

