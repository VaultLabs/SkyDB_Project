# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `bootstrap`

1) Start Ceramic Daemon
`ceramic daemon`

2) In another tab run the following to bootstrap IDX to Ceramic Node
`idx bootstrap`
`idx did:create --label=local`
`idx index:check local #use the label defined above`

3) Then create a config.json file in ./src directory

4) Then from root run
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
`SEED=<your seed> node ./bootstrap`

5) The cli shoud log the following: 
```json
Config written to src/config.json file: {
  definitions: {
    notes: 'kjzl6cwe1jw148gg0qxw3ca24rtxreuxg1roqlbm5j3zkfeijz9si8yhmuxx1ok'
  },
  schemas: {
    Note: 'ceramic://kjzl6cwe1jw149dxbnodss8ndjqb1vrsdvksqj53kzfz2n5v8unjzvu86fi2jns',
    NotesList: 'ceramic://kjzl6cwe1jw145w77c13w4uxovsbmwipufpbekt7n07pwvnrmn2o0zbhwoomr1c'
  }
}
```

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
