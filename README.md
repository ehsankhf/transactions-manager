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
   2. `npm run start:client`
   2. `npm run start:server`
 
## Available Scripts

In the project directory, you can run:

### Client-side

- `npm run start:client` : Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- `npm run test:client` : Launches the test runner in the interactive watch mode.
- `npm run build:client` : Building the bundles. To load the bundles you can create a local server by doing the followings:
  1. `npm install -g serve`
  2. `serve -s build`

### Server-side

- `npm start` : Runs the server on port 5000.
- `npm run test:server` : Launches the test runner.

## License

[MIT licensed](LICENSE).



