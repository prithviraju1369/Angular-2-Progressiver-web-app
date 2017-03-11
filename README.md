# Shoppinglist

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1.

## Development server
## install angular cli

1.npm install -g @angular/cli@latest

## install project dependencies 
2.npm install

## build local project
3. ng build --prod --aot

## Run Locally
4. node server.js

## Email Functionality

Go to : https://www.google.com/settings/security/lesssecureapps
set the Access for less secure apps setting to Enable

Update usernam and password in server.js

## firebase config

generate firebase config from https://console.firebase.google.com/

// firebase frontend configuration
// See https://console.firebase.google.com/project/fergg-c183c/database/data to live view the data
export const firebaseConfig = {
    apiKey: "xxxx","xxxx",
    authDomain: "xxxx",
    databaseURL: "https://shoppinglist-12407.firebaseio.com",
    storageBucket: "shoppinglist-12407.appspot.com",
    messagingSenderId: "xxxx",
};

create firebase-secret.js in project directory and paste the firebase secret.