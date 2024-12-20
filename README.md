# Starting the server

-   Clone the repository
-   run
    ```bash
    npm install
    ```
-   Run the following
    ```bash
    touch .env
    ```
-   Open the `.env` file and enter the MongoDB URL (Soumyajyoti has it)
    ```
    URL="mongodb+srv://username:password@mongoatlascluster"
    ```
-   Run locally
    ```bash
    npm run serve
    ```
-   For contribution
    ```bash
    git checkout -b dev
    npm run format
    npm run serve
    ```
-   Push the code after contribution
    ```bash
    npm run format
    git add .
    git commit -m "new changes"
    git push
    ```
