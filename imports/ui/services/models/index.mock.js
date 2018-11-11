/*
This is used to mock redux stores with no external dependencies such as Minimongo.
Data is static, no external calls
 */

// Issues
export { default as issuesView } from './issues/View.mock.js';
export { default as issuesFetch } from './issues/Fetch.mock.js';

// Users
export { default as usersFetch } from './users/Fetch.js';
export { default as usersView } from './users/View.mock.js';


