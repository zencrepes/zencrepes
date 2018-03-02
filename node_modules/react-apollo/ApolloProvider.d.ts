/// <reference types="react" />
import { Component } from 'react';
import ApolloClient from 'apollo-client';
export interface ProviderProps<TCache> {
    client: ApolloClient<TCache>;
}
export default class ApolloProvider<TCache> extends Component<ProviderProps<TCache>, any> {
    static propTypes: {
        client: any;
        children: any;
    };
    static childContextTypes: {
        client: any;
    };
    constructor(props: any, context: any);
    getChildContext(): {
        client: ApolloClient<TCache>;
    };
    render(): JSX.Element;
}
