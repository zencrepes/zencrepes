/// <reference types="react" />
import { ReactElement } from 'react';
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
export interface Context<Cache> {
    client?: ApolloClient<Cache>;
    store?: any;
    [key: string]: any;
}
export interface QueryTreeArgument<Cache> {
    rootElement: ReactElement<any>;
    rootContext?: Context<Cache>;
}
export interface QueryResult<Cache> {
    query: Promise<ApolloQueryResult<any>>;
    element: ReactElement<any>;
    context: Context<Cache>;
}
export declare function walkTree<Cache>(element: ReactElement<any>, context: Context<Cache>, visitor: (element: ReactElement<any>, instance: any, context: Context<Cache>) => boolean | void): void;
export declare function getDataFromTree(rootElement: ReactElement<any>, rootContext?: any, fetchRoot?: boolean): Promise<void>;
