# Overview

ZenCrepes has been created to provide greater insight in a team's operation while using Github issues across multiple organizations and multiple repositories. 

It is built around 5 major sections:
* __Issues__: Using faceted search, quickly visualize metrics of interest over all or a subset of GitHub issues
* __Sprints__: Facilitates sprints planning and health check by providing details about remaining tasks, overall effort as well as past velocity for the sprints' team.
* __Labels__: Harmonize labels across GitHub organizations and repositories
* __Milestones__: View and manage milestones across GitHub organizations and repositories
* __Settings__: Configure the application, select organizations and repositories of interest, setup points, ...

Although created to operate with story points, some of the view contains a switch to toggle metrics between story points and issues count.

# Technical choices

This application has been created from the ground up to be client-side, it makes direct GraphQL calls to GitHub API and compute all metrics in-browser.

# Stack

The following frameworks/libraries are used:
* __React__: Well, React ...
* __Material-Ui__: UI library following Google's Material style
* __Meteor__: Using meteor for this app is overkill, since most of its backend components are not used. The only reason for the need of a backend component is GitHub authentication
* __GraphQL/Apollo__: Used for fetching content from GitHub (repositories, issues, milestones, labels, users)
* __Github Octokit__: GitHub library for operating towards Github APIv3. Most mutations used by this applications are not supported by Github APIv4.
* __Nivo__: Charting library
* __Highcharts__: Charting library
* __Redux/Rematch__: Redux store
* __Storybook__

## Limitations

Having all of the application's logic on the client involves some limitations with the app.

### No push updates

It is not possible for GitHub to automatically push updated content to the app. Using the available GitHub hooks would require servers to receive POSTS from Github. Instead the application requires data from GitHub to be pulled at regular interval. 

### Performance

The app performs compute intensive tasks over a all of its cached content. Instances being single-threaded, you might notice, depending of the size of your dataset, slight slowdown as computation takes place.

# Setup


# Development


# Production

