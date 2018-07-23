import React from 'react';
import { Link } from 'react-router-dom';

import SquareIcon from 'mdi-react/SquareIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import { GithubCircle } from 'mdi-material-ui'

import {
    // State or Local Processing Plugins
    SelectionState,
    PagingState,
    IntegratedSelection,
    IntegratedPaging,
    DataTypeProvider,
} from '@devexpress/dx-react-grid';

const ColorsFormatter = ({ value }) => {
    return <div><SquareIcon color={value} />{value}</div>
};

export const ColorsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ColorsFormatter}
        {...props}
    />
);

const DescriptionsFormatter = ({ value }) => {
    if (value === undefined) {return '';}
    else {return value;}
};

export const DescriptionsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DescriptionsFormatter}
        {...props}
    />
);

const LinkFormatter = ({ value }) => {
    return (
        <Link to={value}>
            <GithubCircle />
        </Link>
    )
};

export const LinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={LinkFormatter}
        {...props}
    />
);

const EditLabelFormatter = (value) => {
    return <Link to={"/labels/edit/" + value.row.name + "/" + value.row.id}><PencilIcon /></Link>;
};

export const EditLabelTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={EditLabelFormatter}
        {...props}
    />
);