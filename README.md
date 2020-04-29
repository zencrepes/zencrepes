[![Slack](http://slack.overture.bio/badge.svg)](http://slack.overture.bio)

<h1 align="center"> Zencrepes </h1><br>

<p align="center">
Agile analytics and management across GitHub organizations & repositories made easy!
</p>

<p align="center">
  <a href="https://zencrepes.io" target="_blank"><img alt="Issues View" title="Issues view" src="./docs/zencrepes-issues.png" width="640" /></a>
</p>

# Stack Health

| Codebase                                                         | Release                                                          | Build (CI/CD)                                                                                                                                                                                                                                                                                                  | NPM                                                                                         | Docker                                                                         | Downloads                                                                                                                                                                       | Status                                                                                                     |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [zencrepes](https://github.com/zencrepes/zencrepes) (serverless) | n/a                                                              | Master: [![CircleCI](https://circleci.com/gh/zencrepes/zencrepes/tree/master.svg?style=svg)](https://circleci.com/gh/zencrepes/zencrepes/tree/master) Develop: [![CircleCI](https://circleci.com/gh/zencrepes/zencrepes/tree/develop.svg?style=svg)](https://circleci.com/gh/zencrepes/zencrepes/tree/develop) | n/a                                                                                         | n/a                                                                            | n/a                                                                                                                                                                             | [![CircleCI](https://badgen.net/uptime-robot/day/ur829647-a6482071c42c624353c06a7d)](https://zencrepes.io) |
| [zindexer](https://github.com/zencrepes/zindexer)                | ![Release](https://badgen.net/github/release/zencrepes/zindexer) | ![Lint and test](https://github.com/zencrepes/zindexer/workflows/Lint%20and%20test/badge.svg) ![Publish to Registry](https://github.com/zencrepes/zindexer/workflows/Publish%20to%20Registry/badge.svg?branch=master)                                                                                          | [![Version](https://img.shields.io/npm/v/zindexer.svg)](https://npmjs.org/package/zindexer) | ![Docker Size](https://badgen.net/docker/size/zencrepes/zindexer/latest/amd64) | [![Downloads/week](https://img.shields.io/npm/dw/zindexer.svg)](https://npmjs.org/package/zindexer) ![Docker Pulls API](https://img.shields.io/docker/pulls/zencrepes/zindexer) | n/a                                                                                                        |
| [zui](https://github.com/zencrepes/zui)                          | ![Release](https://badgen.net/github/release/zencrepes/zui)      | ![Lint and test](https://github.com/zencrepes/zui/workflows/Lint%20and%20test/badge.svg) ![Publish to Registry](https://github.com/zencrepes/zui/workflows/Publish%20to%20Registry/badge.svg)                                                                                                                  | n/a                                                                                         | ![Docker Size](https://badgen.net/docker/size/zencrepes/zui/latest/amd64)      | ![Docker Pulls API](https://img.shields.io/docker/pulls/zencrepes/zui)                                                                                                          | n/a                                                                                                        |
| [zapi](https://github.com/zencrepes/zapi)                        | ![Release](https://badgen.net/github/release/zencrepes/zapi)     | ![Lint and test](https://github.com/zencrepes/zapi/workflows/Lint%20and%20test/badge.svg) ![Publish to Registry](https://github.com/zencrepes/zapi/workflows/Publish%20to%20Registry/badge.svg)                                                                                                                | n/a                                                                                         | ![Docker Size](https://badgen.net/docker/size/zencrepes/zapi/latest/amd64)     | ![Docker Pulls API](https://img.shields.io/docker/pulls/zencrepes/zapi)                                                                                                         | n/a                                                                                                        |

# Documentation

You can find ZenCrepes documentation on [docs.zencrepes.io](https://docs.zencrepes.io/).

This readme only contains developer-focused details.

# Reach-out

I'd be more than happy to get feedback and external contributions, just submit a PR with your requested changes. Feel free to reach out on [slack](http://slack.overture.bio/), ZenCrepes has a dedicated channel on `#app_zencrepes`.

Overture gracefully provides the VM instance hosting dev & prod and the slack channel. ZenCrepes is not an Overture project.

# Develop

ZenCrepes is just at the beginning of its adventure, and contributions guidelines will evolve over time.

## Develop on ZenCrepes locally.

The instructions below are going to be for Mac but should be very similar to other environments.

### Fork and Clone ZenCrepes repository

In GitHub, create a fork of ZenCrepes' repository into your own profile.

<p align="center">
  <img alt="Fork ZenCrepes repository" title="Fork ZenCrepes repository" src="./docs/zencrepes-dev-fork.png" />
</p>

Once done, clone the forked repository locally (replace the URL below with your fork).

```bash
git clone git@github.com:Fgerthoffert/zencrepes.git
```

### Install dependencies

Once done, cd into the repo's directory and install the required dependencies.

```bash
# Download and install Meteor
curl https://install.meteor.com | /bin/sh
# Install the dependencies
meteor npm install
```

And that should be it.

### Register the app in GitHub.

Next, you need to register your app in GitHub to be able to log-in during your testing.

Open-up GitHub, and navigate to your `settings`.

<p align="center">
  <img alt="Issues View" title="GitHub Settings" src="./docs/zencrepes-dev-github-settings.png" />
</p>

Go to `Developer Settings` and click on `New OAuth App`.

<p align="center">
  <img alt="GitHub Developer Settings" title="GitHub Developer Settings" src="./docs/zencrepes-dev-github-developersettings.png" width="640" />
</p>

Pick a name to your app and register it with the following URLs:

<p align="center">
  <img alt="Register OAuth app" title="Register OAuth app" src="./docs/zencrepes-dev-github-oauth.png" />
</p>

You will then be redirected to a screen containing your Client ID and Client Secret.

### Modify settings.json

With your favorite editor, open the file `settings.json` at the root of the repository you just cloned.

```json
{
  "public": {
    "analyticsSettings": {
      "Google Analytics": { "trackingId": "GOOGLE_ANALYTICS" }
    },
    "menus": {}
  },
  "private": {
    "MAIL_URL": "",
    "OAuth": {
      "github": {
        "clientId": "METEOR_GITHUB_CLIENTID",
        "secret": "METEOR_GITHUB_CLIENTSECRET",
        "loginStyle": "popup"
      }
    }
  }
}
```

Replace METEOR_GITHUB_CLIENTID and METEOR_GITHUB_CLIENTSECRET with the secrets you just obtained.

No need to modify GOOGLE_ANALYTICS, which is just used to provide usage metrics for zencrepes.io and dev.zencrepes.io.

### Launch ZenCrepes

Back to your terminal, in the `zencrepes` directory, just launch meteor with the following command.

```bash
# Launch Meteor
meteor --settings settings.json
```

And that's it, you can now access your local instance of Zencrepes pointing your browser to `http://localhost:3000` and start coding.

## Deploy ZenCrepes to prod

If you contribute to ZenCrepes, you shouldn't have to worry about this aspect as ZenCrepes was set up to autodeploy to zencrepes.io and dev.zencrepes.io, but if you ever want to deploy your own instance online, you'll find some brief instructions below.

### Configuration

It is possible to indicate which top-level menus should be made available to the running app by updating the menu key in `settings.json`. If the object is empty `{}`, all menus are shown.

```json
{
  "issues": true,
  "sprints": true,
  "milestones": true,
  "labels": false,
  "settings": true
}
```

This is useful to make different menus available depending of the environment.

### Deployment

The best source of instructions for deploy is actually the `.circleci` config available here: https://github.com/Fgerthoffert/zencrepes/blob/master/.circleci/config.yml
