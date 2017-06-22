Prerequisites:
1. yarn - https://yarnpkg.com/lang/en/docs/install/

If you want to start a local development environment execute the following commands in your terminal:
1. yarn(same as npm install)
2. yarn dev_front
3. yarn dev_back in another terminal instance

yarn dev_front will start webpack - utility that will watch .js files in client/src
and recompile(from es6 JSX to es5 standard JS) and bundle them into client/public/bundle.js.
Also it will copy the index.html file from client/src to client/public.
- yarn dev_front uses webpack.config.dev.js for configuration
- all the frontend react code is in client/src

yarn dev_back will start nodemon - utility that will watch .js files in the current directory
and restart your server every time change occures. 
- all the logic for this tiny app is in index.js file

TODO:
1. write some tests to get more familiar with testing react app.
2. rewrite backend(index.js) because its a pile of shit and not a good code i can be proud of.
3. rewrite frontend(client/src) because its a pile of shit and not a good code i can be proud of.

p.s. made for interview in about 7 hours if fiddling around with webpack, webpack-dev-server, webpack-dashboard,
babel, eslint and others doesn't count)