
export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
//export const localCfgSources = new PersistentMinimongo2(cfgSources, 'GAV-Repos');
window.repos = cfgSources;

export const cfgIssues = new Mongo.Collection('cfgIssues', {connection: null});
//export const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues');
window.issues = cfgIssues;

export const cfgLabels = new Mongo.Collection('cfgLabels', {connection: null});
//export const localCfgLabels = new PersistentMinimongo2(cfgLabels, 'GAV-Labels');
window.labels = cfgLabels;

export const cfgQueries = new Mongo.Collection('cfgQueries', {connection: null});
//export const localCfgQueries = new PersistentMinimongo2(cfgQueries, 'GAV-Queries');
window.queries = cfgQueries;

