export const cfgQueries = new Mongo.Collection('cfgQueries', {connection: null});
export const localCfgQueries = new PersistentMinimongo2(cfgQueries, 'GAV-Issues');
window.queries = cfgQueries;

