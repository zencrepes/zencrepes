[![CircleCI](https://circleci.com/gh/Fgerthoffert/zencrepes/tree/master.svg?style=svg)](https://circleci.com/gh/Fgerthoffert/zencrepes/tree/master)

<h1 align="center"> Zencrepes </h1><br>

<p align="center">
Agile analytics and management across GitHub organizations & repositories made easy!
</p>

<p align="center">
  <a href="https://zencrepes.io" target="_blank"><img alt="Issues View" title="Issues view" src="./docs/zencrepes-issues.png" width="640" /></a>
</p>

## Table of Contents

- [Introduction](#introduction)
- [How it Works](#how-it-works)
- [Try-it](#try-it)

## Introduction

ZenCrepes has been created by a PM (excuse the poor programming) to facilitate project management for teams operating solely over GitHub issues across multiple repositories and organizations.

It focuses on three primary objects
* __Report and search__: Quickly find a relevant issues based on selected criteria (faceted search). For example `List open defects assigned to John or Max in rock or paper repos` or `Display the team's velocity on paper and scissor repos`.
* __Scrum operation__: Identify the amount of work left in a sprint, estimate completion based on past velocity, review repartition of open issues (by repo, by label, by assignees).
* __Consistency__: Ensure labels and milestones are consistent across multiple organizations and repositories, clean-up when necessary.

## How it works

ZenCrepes is entirely client-side by choice. This means ZenCrepes barely needs very few resources to run (the server component is only needed to support GitHub OAuth flow), but also and most importantly, that whoever running ZenCrepes cannot see any user data. Once authenticated, all data exchanges are directly made between the user's browser and GitHub.

But this this approach has two major drawbacks:
* ZenCrepes cannot register to GitHub hooks, therefore cannot be `informed` about updates. Instead, it needs to regularly pull for changes.
* Since the database (Minimongo) is entirely client-side and bound to the browser's capabilities, the more data there is, the slower ZenCrepes is going to be. A couple thousands issues should be perfectly fine though.

## Try-it !

Just go to https://zencrepes.io and log-in. It's all client size, so not a chance we'll see your data.

## What's Next ?
_(and quick note from the Author)_

In its current state, ZenCrepes is really more a proof-of-principle app than something with a proper design and correct implementation. Nevertheless, it does work, and already greatly simplifies the management for a particular team.

When starting ZenCrepes, the vision was to create an app sitting entirely sit on top of GitHub API, without needing any additional metadata stored elsewhere. The point was not to create a competitor to ZenHub or Waffle, but to get remove the need from using those. To give developers (and the team as a whole) the choice between updating their issues directly in GitHub or through an app (like ZenCrepes), both options achieving the same result.

Finally, ZenCrepes is OpenSource and the hope is that if enough people are interested in the app, it will encourage contribution to its codebase. Getting a community of contributors to help build the necessary improvements, to hopefully get to an open platform built by team managers for team managers.

## Quick Guide

### Wizard

When opening-up ZenCrepes for the first time, a quick configuration wizard is presented, it provides general ZenCrepes explanations and allow users to select repositories to load data from.

<p align="center">
  <img alt="Issues View" title="Issues view" src="./docs/zencrepes-wizard.png" width="640" />
</p>

ZenCrepes can automatically fetch the repositories directly affiliated with the user, but it can also fetch data from public organizations and repositories, as long as they are configured to allow such action. Some that do are: jetbrains, microsoft (individual repositories, for example: cntk).

## Velocity

Velocity is an interesting metric, it gives a sense of a team's pace and potentiality to meet certain deadlines. But velocity metrics are not the single mean of estimating, it is one of the many elements to be used when planning and forecasting.

In most of its screens, ZenCrepes uses weekly velocity calculated on a 4 weeks rolling average from the last datapoint. For example, the velocity of week 4 is the (W1+W2+W3+W4)/4 (yes it does include the current week).

ZenCrepes will also try to forecast how much time is needed to complete a set of open issues. Forecast will usually display 4 values:

* using average velocity over the entire project
* using average velocity over the past 12 weeks
* using average velocity over the past 8 weeks
* using average velocity over the past 4 weeks (default)

Variation in the displayed average also gives interesting indications whether the team has a steady pace, is accelerating or slowing down...

But again, understand what you are asking the metrics to provide.

Finally, when planning a new sprint, velocity is calculated as a sum of all of the individual contributors past velocities across all past issues. As explained above, understand the implications of such a statement.

### Staging changes

There are no backups of GitHub's content, so if you perform an action by mistake (like deleting the wrong Milestone), you are going to loose data. To make everything a bit safer, before pushing any changes, ZenCrepes does show you a list of all the changes that are about to be sent to GitHub's API.

During that stage, ZenCrepes is also going to query each of the individual elements to pull its latest version from GitHub, this prevents issues associated with an outdated local cache. If an individual node updatedAt value is different between local and GitHub, you will not be able to submit those changes. You will have to either remove this node from the list of changes or close the screen and perform the change again. This was done this way on purpose !

### Issues

The objective of the Issues view is to quickly filtering down issues using faceted search and see metrics resulting of a particular set of issues.

<p align="center">
  <img alt="Issues View" title="Issues view" src="./docs/zencrepes-issues.png" width="640" />
</p>

Notice the switch `Issues Count` vs `Story Points` at the top of the screen. Story Points is the default, but the system will automatically fall back to Issues Count if no points were found, it's a non-accurate mean, but still can give relevant insights.

### Sprints

The objective of the Sprints view is to provide close-up insights into a particular sprint and usable during the various scrum team meetings.

<p align="center">
  <img alt="Issues View" title="Issues view" src="./docs/zencrepes-sprints.png" width="640" />
</p>

It provides the following:
* Completion status in terms of ticket counts and Points
* Breakdown of remaining points by assignee
* Estimated Completion using various velocity metrics
* Markdown-style sprint notes
* Burndown chart for the current sprint
* Team velocity over the past 16 weeks
* List of issues
* Breakdown of issues count and points by assignees
* Breakdown of issues count and points by milestones
* Breakdown of issues count and points by labels

Since ZenCrepes cannot automatically be informed about changes in GitHub, an auto-refresh feature is available on this screen. It refreshes issues from all milestones (see the milestone table at the bottom of the screen) every 2 minutes, for 20 occurrences (so about 40mn total). Then the user has to re-activate auto-refresh. It can also be disabled anytime.

### Labels

The objective of the Labels view is to simplify management of labels across organizations and repository. Easily push a single label to 10s of repositories, easily apply a consistent color for one label across multiple repositories, ...

<p align="center">
  <img alt="Issues View" title="Issues view" src="./docs/zencrepes-labels.png" width="640" />
</p>

Modifications are bound to the query being applied, for example if you select repo A & B, modifying or creating a label, will be bound to those 2 repositories only.

### Milestones

An almost identical approach than Labels but for GitHub milestones.

<p align="center">
  <img alt="Issues View" title="Issues view" src="./docs/zencrepes-milestones.png" width="640" />
</p>


### Settings

The settings view allows users to select which repository to load data from. It shoes the same screens than the configuration wizard.

<p align="center">
  <img alt="Issues View" title="Issues view" src="./docs/zencrepes-settings.png" width="640" />
</p>




## Run it yourself

### Settings

ZenCrepes is built on top of Meteor (maybe a bit overkill for the task), which need a simple setings.json file to start.

```$json
{
  "public": {
    "analyticsSettings": {
      "Google Analytics" : {"trackingId": "GOOGLE_ANALYTICS"}
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

You can obtain a github secrets by logging into Github.com, then `Your user > Settings > Developer Settings > New OAuth App`.

### In Dev

Simply install [meteor](https://www.meteor.com/install) by running `curl https://install.meteor.com/ | sh`, then clone the repo, update settings-development.json in the root directory, then `meteor --settings settings-development.json`

### In `Prod`

A DockerFile (simplified) and docker-compose.yml are provided in the repo, making it easy to deploy an instance, just modify the files to match your environment.

You can also use the circleci config provided, you would need to populate circleci environment variables $METEOR_SETTINGS_DEV and/or $METEOR_SETTINGS_PROD with the content of settings.json as a 1-liner.

### Configuration

#### Menus

It is possible to indicate which top level menus should be made available to the running app by updating the menu key in settings.json. If the object is empty `{}`, all menus are shown.
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

## Contribute

I'd be more than happy to get feedback and external contributions, just submit a PR with your requested changes. Feel free to ping me on [slack](http://slack.overture.bio/) first.