import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { Provider } from 'react-redux';
import { init } from "@rematch/core";

import Actions from '../imports/ui/views/Sprints/Actions/index.js';

// The *.mock.js files contains static redux stores configuration with no external dependencies (such as minimongo).
import * as models from "../imports/ui/services/models/index.mock.js";
//https://medium.com/ingenious/storybook-meets-redux-6ab09a5be346

const store = init({
    models
});

const query = JSON.parse("{\"repo.name\":{\"$in\":[\"ego\",\"enrolment\",\"score\"]},\"author.login\":{\"$in\":[\"lepsalex\"]},\"assignees.edges\":{\"$elemMatch\":{\"node.login\":{\"$in\":[\"lepsalex\",\"rtisma\"]}}}}");
const facets = JSON.parse("[{\"key\":\"repo.name\",\"name\":\"Repositories\",\"nested\":false,\"aggregations\":{}},{\"key\":\"org.name\",\"name\":\"Organizations\",\"nested\":false,\"aggregations\":{}},{\"key\":\"state\",\"name\":\"States\",\"nested\":false,\"aggregations\":{}},{\"key\":\"author.login\",\"name\":\"Authors\",\"nested\":false,\"aggregations\":{}},{\"key\":\"milestone.title\",\"name\":\"Milestones\",\"nullValue\":\"NO MILESTONE\",\"nullFilter\":{\"milestone\":{\"$eq\":null}},\"nested\":false,\"aggregations\":{}},{\"key\":\"milestone.state\",\"name\":\"Milestones States\",\"nested\":false,\"aggregations\":{}},{\"key\":\"assignees\",\"name\":\"Assignees\",\"nullValue\":\"UNASSIGNED\",\"nullFilter\":{\"assignees.totalCount\":{\"$eq\":0}},\"nested\":true,\"nestedKey\":\"login\",\"aggregations\":{}},{\"key\":\"labels\",\"name\":\"Labels\",\"nullValue\":\"NO LABEL\",\"nullFilter\":{\"labels.totalCount\":{\"$eq\":0}},\"nested\":true,\"nestedKey\":\"name\",\"aggregations\":{}}]");
const queries = JSON.parse("[{\"_id\":\"zZckgEve3mQ2Ems3X\",\"name\":\"HCMI\",\"filters\":\"{\\\"org.name\\\":{\\\"header\\\":\\\"Organizations\\\",\\\"group\\\":\\\"org.name\\\",\\\"type\\\":\\\"text\\\",\\\"nested\\\":false,\\\"in\\\":[\\\"Human Cancer Models Initiative - Catalog\\\"],\\\"nullSelected\\\":false}}\"},{\"_id\":\"eGHLjEnwQPCmfL6nf\",\"name\":\"Sprint 196\",\"filters\":\"{\\\"milestone.title\\\":{\\\"header\\\":\\\"Milestones\\\",\\\"group\\\":\\\"milestone.title\\\",\\\"type\\\":\\\"text\\\",\\\"nested\\\":false,\\\"nullName\\\":\\\"NO MILESTONE\\\",\\\"nullFilter\\\":{\\\"milestone\\\":{\\\"$eq\\\":null}},\\\"in\\\":[\\\"ARGO - Sprint 196\\\"],\\\"nullSelected\\\":false}}\"},{\"_id\":\"eXLRwr6GMy24xekY7\",\"name\":\"All (No filter)\",\"filters\":\"{}\"},{\"_id\":\"pXSPd7yweAAd9Rncf\",\"name\":\"Query Test\",\"filters\":\"{\\\"assignees\\\":{\\\"header\\\":\\\"Assignees\\\",\\\"group\\\":\\\"assignees\\\",\\\"type\\\":\\\"text\\\",\\\"nested\\\":\\\"login\\\",\\\"nullName\\\":\\\"UNASSIGNED\\\",\\\"nullFilter\\\":{\\\"assignees.totalCount\\\":{\\\"$eq\\\":0}},\\\"in\\\":[\\\"lepsalex\\\",\\\"hlminh2000\\\"],\\\"nullSelected\\\":false},\\\"milestone.state\\\":{\\\"header\\\":\\\"Milestones States\\\",\\\"group\\\":\\\"milestone.state\\\",\\\"type\\\":\\\"text\\\",\\\"nested\\\":false,\\\"in\\\":[\\\"OPEN\\\"],\\\"nullSelected\\\":false},\\\"org.name\\\":{\\\"header\\\":\\\"Organizations\\\",\\\"group\\\":\\\"org.name\\\",\\\"type\\\":\\\"text\\\",\\\"nested\\\":false,\\\"in\\\":[\\\"Human Cancer Models Initiative - Catalog\\\",\\\"Kids First Data Resource Center\\\"],\\\"nullSelected\\\":false}}\"},{\"_id\":\"EF43Hd9hdZPXtGrMC\",\"name\":\"New Name\",\"filters\":\"{}\"},{\"_id\":\"Bv69Mo2hrKpN6o66W\",\"name\":\"Ego\",\"filters\":\"{\\\"repo.name\\\":{\\\"$in\\\":[\\\"enrolment\\\",\\\"ego\\\"]}}\"},{\"_id\":\"T7GtapWTpP4PBdoXe\",\"name\":\"Ego-\",\"filters\":\"{\\\"repo.name\\\":{\\\"$in\\\":[\\\"ego\\\",\\\"enrolment\\\"]}}\"}]");

const repoFacet = JSON.parse("{\"key\":\"repo.name\",\"name\":\"Repositories\",\"nested\":false,\"aggregations\":{},\"values\":[{\"name\":\"SONG\",\"count\":173,\"points\":73},{\"name\":\"arranger\",\"count\":143,\"points\":265},{\"name\":\"ego\",\"count\":78,\"points\":149},{\"name\":\"enrolment\",\"count\":69,\"points\":8},{\"name\":\"Jukebox\",\"count\":37,\"points\":1},{\"name\":\"score\",\"count\":30,\"points\":28},{\"name\":\"website\",\"count\":16,\"points\":0},{\"name\":\"persona\",\"count\":14,\"points\":33},{\"name\":\"roadmap\",\"count\":10,\"points\":8},{\"name\":\"ego-ui\",\"count\":6,\"points\":3},{\"name\":\"riff\",\"count\":5,\"points\":3},{\"name\":\"baton\",\"count\":3,\"points\":0},{\"name\":\"song-client\",\"count\":3,\"points\":5},{\"name\":\"rollcall\",\"count\":3,\"points\":3},{\"name\":\"microservice-template-java\",\"count\":2,\"points\":0},{\"name\":\"minime\",\"count\":1,\"points\":0},{\"name\":\"ego-token-middleware\",\"count\":1,\"points\":0},{\"name\":\"alter-ego\",\"count\":1,\"points\":0}]}");

storiesOf('Sprints', module)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('Action Bar', () => (
        <Actions />
    ))
;