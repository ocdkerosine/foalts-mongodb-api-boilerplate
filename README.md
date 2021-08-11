<h1 align="center">Welcome to FoalTS-MongoDB QuickStart 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D10-blue.svg" />
  <a href="https://twitter.com/telobriggs" target="_blank">
    <img alt="Twitter: telobriggs" src="https://img.shields.io/twitter/follow/telobriggs.svg?style=social" />
  </a>
</p>

> Boilerplate code for production ready-to-ship API's

### ✨ [Demo](https://payqart-api.herokuapp.com)

## Why this exists

The love affair between NodeJS and MongoDB was a match made in scripting heaven. Unfortunately TypeORM (the default ORM for FoalTS) does not fully support MongoDB and as of the [Pull RQ](https://github.com/FoalTS/foal/pull/741) support for mongoose was removed.

This template serves as a ready to use quickstart featuring Typegoose (Typed Mongoose) to help you overcome the challenge stated above.

Before you proceed kindly go through [this page on the foalts repo](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#dependency-policy) as this template includes additional dependencies and @types due to typescript and linting rules used by the author -- Me! 😅.

## What is Foal?

*Foal* (or *FoalTS*) is a Node.JS framework for creating web applications.

It provides a set of ready-to-use components so you don't have to reinvent the wheel every time. In one single place, you have a complete environment to build web applications. This includes a CLI, testing tools, frontend utilities, scripts, advanced authentication, ORM, deployment environments, GraphQL and Swagger API, AWS utilities, and more. You no longer need to get lost on npm searching for packages and making them work together. All is provided.

But while offering all these features, the framework remains simple. Complexity and unnecessary abstractions are put aside to provide the most intuitive and expressive syntax. We believe that concise and elegant code is the best way to develop an application and maintain it in the future. It also allows you to spend more time coding rather than trying to understand how the framework works.

Finally, the framework is entirely written in TypeScript. The language brings you optional static type-checking along with the latest ECMAScript features. This allows you to detect most silly errors during compilation and improve the quality of your code. It also offers you autocompletion and a well documented API.

![Screenshot](https://github.com/FoalTS/foal/blob/master/docs/static/img/home/screenshot.png)

## :city_sunrise: Get started

First install [Node.Js and npm](https://nodejs.org/en/download/).

### Clone/Use Template from this repo

```
$ git clone https://github.com/ocdkerosine/foalts-mongodb-api-boilerplate.git
$ npm install
$ cd foalts-mongodb-api-boilerplate
$ npm run dev
```

The development server is started! Go to `http://localhost:3001` and find our welcoming page!

:point_right: [Continue with the tutorial](https://foalts.org/docs) :seedling:

## Run tests

```sh
npm run test
```

## Deploying to Heroku

Here is an example on how to deploy to [Heroku](https://heroku.com) using [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line):
```bash
# start a new local git repository
git init

# create a new heroku app
heroku apps:create my-new-app

# add heroku remote reference to the local repository
heroku git:remote --app my-new-app

# add the MongoLab addon to the heroku app
heroku addons:create mongolab

# set the environment variables to the heroku app (see the .env file in root directory)
heroku config:set JWT_SECRET=jwtSecret

# commit and push the files
git add -A
git commit -m "Initial commit"
git push heroku master

# open the deployed app in the browser
heroku open
```

The second time you deploy, you just need to:

```bash
git add -A
git commit -m "Update code"
git push heroku master
```

## Author

👤 **Gbeminiyi 'Telo Briggs' Oshoba**

* Website: proditt.com
* Twitter: [@telobriggs](https://twitter.com/telobriggs)
* Github: [@ocdkerosine](https://github.com/ocdkerosine)
* LinkedIn: [@gbeminiyi](https://linkedin.com/in/gbeminiyi)

## Show your support

Give a ⭐️ if this project helped you!
