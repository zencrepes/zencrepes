# ZenCrepes

ZenCrepes has been created by a PM (excuse the poor programming) to facilitate project management for teams operating solely over GitHub issues across multiple repositories and organizations. 

It focuses on three primary objects
* __Report and search__: Quickly find a relevant issues based on selected criteria (faceted search). For example `List open defects assigned to John or Max in rock and paper repos` or `Display the team's velocity on paper and scissor repos`.
* __Scrum opeation__: Identify the amount of work left in a sprint, estimate completion based on past velocity, review repartition of open issues (by repo, by label, by assignees).
* __Consistency__: Ensure labels and milestones are consistent across multiple organizations and repositories, clean-up when necessary.

## How it works

ZenCrepes is entirely client-side, by choice. This means ZenCrepes barely needs a server to run (the server component is only needed to support GitHub OAuth flow), but also and most importantly that whoever is running ZenCrepes cannot see any user data. Once authenticaed, all data exchanges are directly made between the user's browser and GitHub.

But this this approach has two major drawbacks:
* ZenCrepes cannot register to GitHub hooks, therefore cannot be `informed` about updates. Insteads it needs to regularly pull for changes
* The more data there, the slower ZenCrepes is going to be, since the database is entirely client-size (Minimongo)

## Try-it !

Just go to https://zencrepes.io and log-in. Again, it's all client size, so not a chance we'll see your data.

## Run it yourself

### Settings

ZenCrepes is built on top of Meteor (maybe a bit overkill for the task), which need a simple setings.json file to start.

```$json
{
  "public": {},
  "private": {
    "MAIL_URL": "",
    "OAuth": {
      "github": {
        "clientId": "CLIENTID",
        "secret": "SECRET",
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

## Contribute

I'd be more than happy to get feedback and external contributions, just submit a PR with your requested changes. Feel free to ping me on [slack](http://slack.overture.bio/) first.

