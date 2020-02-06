## Transactions Manager

A sample project for testing the integration with the TrueLayer API.

## Local setup

 - Requirements
   - Docker
   - Node.js
 
 - Steps to run in development mode
   1. `docker-compose up`
       - Please create following databases in the locally created mysql database server `localhost:3306` :
           1. `database_development` : for the **normal** run of the server 
           1. `database_test` : for the **test** run of the server 
   2. `npm run start`
   
## Initial configurations for TrueLayer API
- setup a new user inside TrueLayer API`s website
- set the api environment as Sandbox
- receive the client id and secret from the API`s dashboard
- add a new redirect url as: `http://localhost:5000/auth/transaction` 
- receive and configure the authentication url
- copy the example.env file as .env in the root directory, and set the following variables:
  - TRUE_LAYER_CLIENT_SECRET
  - TRUE_LAYER_CLIENT_ID
 
## Available Scripts

In the project directory, you can run:

- `npm start` : Runs the server on port 5000.
- `npm run test` : Launches the test runner.

## License

[MIT licensed](LICENSE).



