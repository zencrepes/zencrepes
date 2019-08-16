import { Mongo } from "meteor/mongo";

export const cfgSources = new Mongo.Collection("cfgSources", {
  connection: null
});
//export const localCfgSources = new PersistentMinimongo2(cfgSources, 'GAV-Repos');
window.sources = cfgSources;

export const cfgIssues = new Mongo.Collection("cfgIssues", {
  connection: null
});
//export const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues');
window.issues = cfgIssues;

export const cfgPullrequests = new Mongo.Collection("cfgPullrequests", {
  connection: null
});
//export const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues');
window.pullrequests = cfgPullrequests;

export const cfgLabels = new Mongo.Collection("cfgLabels", {
  connection: null
});
//export const localCfgLabels = new PersistentMinimongo2(cfgLabels, 'GAV-Labels');
window.labels = cfgLabels;

export const cfgQueries = new Mongo.Collection("cfgQueries", {
  connection: null
});
//export const localCfgQueries = new PersistentMinimongo2(cfgQueries, 'GAV-Queries');
window.queries = cfgQueries;

export const cfgMilestones = new Mongo.Collection("cfgMilestones", {
  connection: null
});
//export const localCfgQueries = new PersistentMinimongo2(cfgQueries, 'GAV-Queries');
window.milestones = cfgMilestones;

export const cfgProjects = new Mongo.Collection("cfgProjects", {
  connection: null
});
//export const localCfgQueries = new PersistentMinimongo2(cfgQueries, 'GAV-Queries');
window.projects = cfgProjects;

export const cfgCards = new Mongo.Collection("cfgCards", { connection: null });
window.cards = cfgCards;

export const cfgRepositories = new Mongo.Collection("cfgRepositories", {
  connection: null
});
window.repos = cfgRepositories;

export const cfgTeams = new Mongo.Collection("cfgTeams", {
  connection: null
});
window.teams = cfgTeams;
