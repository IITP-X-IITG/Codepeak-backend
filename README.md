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
    JWT_SECRET="..."
    ```
-   you can add any string as jwt secret but it would be prefferd if you make a new js file and put
    ```
    console.log(require('crypto').randomBytes(64).toString('hex'))
    ```
    the output that comes out is cryptoghapically secure and is preffred as the new JWT_SECRET key
    
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
