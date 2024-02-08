https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-1-c645c7a27583

mkdir todoapp
cd todoapp
npm init # generates the index.js and package.json
npm install --save express mongoose ejs dotenv
npm install -g nodemon # be sure to install nodemon

Add this line in `package.json'
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index. js"
  },
