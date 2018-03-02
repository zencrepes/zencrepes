(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('apollo-client'), require('apollo-cache-inmemory'), require('prop-types'), require('apollo-link'), require('graphql/language/printer')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'apollo-client', 'apollo-cache-inmemory', 'prop-types', 'apollo-link', 'graphql/language/printer'], factory) :
	(factory((global['react-apollo'] = {}),global.React,global.ApolloClient,global.apolloCacheInmemory,global.PropTypes,global.apolloLink,global.printer));
}(this, (function (exports,React,ApolloClient,apolloCacheInmemory,PropTypes,apolloLink,printer) { 'use strict';

ApolloClient = ApolloClient && ApolloClient.hasOwnProperty('default') ? ApolloClient['default'] : ApolloClient;

function shallowEqual(objA, objB) {
    if (!objA || !objB)
        return false;
    if (objA === objB)
        return true;
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
        return false;
    var hasOwn = Object.prototype.hasOwnProperty;
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }
    return true;
}

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var ObservableQueryRecycler = (function () {
    function ObservableQueryRecycler() {
        this.observableQueries = [];
    }
    ObservableQueryRecycler.prototype.recycle = function (observableQuery) {
        observableQuery.setOptions({
            fetchPolicy: 'standby',
            pollInterval: 0,
            fetchResults: false,
        });
        this.observableQueries.push({
            observableQuery: observableQuery,
            subscription: observableQuery.subscribe({}),
        });
    };
    ObservableQueryRecycler.prototype.reuse = function (options) {
        if (this.observableQueries.length <= 0) {
            return null;
        }
        var _a = this.observableQueries.pop(), observableQuery = _a.observableQuery, subscription = _a.subscription;
        subscription.unsubscribe();
        var ssr = options.ssr, skip = options.skip, client = options.client, modifiableOpts = __rest(options, ["ssr", "skip", "client"]);
        if (!shallowEqual(modifiableOpts.variables || {}, observableQuery.variables))
            return null;
        observableQuery.setOptions(__assign({}, modifiableOpts, { pollInterval: options.pollInterval, fetchPolicy: options.fetchPolicy }));
        return observableQuery;
    };
    return ObservableQueryRecycler;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var QueryRecyclerProvider = (function (_super) {
    __extends$2(QueryRecyclerProvider, _super);
    function QueryRecyclerProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.recyclers = new WeakMap();
        _this.getQueryRecycler = _this.getQueryRecycler.bind(_this);
        return _this;
    }
    QueryRecyclerProvider.prototype.componentWillReceiveProps = function (_, nextContext) {
        if (this.context.client !== nextContext.client) {
            this.recyclers = new WeakMap();
        }
    };
    QueryRecyclerProvider.prototype.getQueryRecycler = function (component) {
        if (!this.recyclers.has(component)) {
            this.recyclers.set(component, new ObservableQueryRecycler());
        }
        return this.recyclers.get(component);
    };
    QueryRecyclerProvider.prototype.getChildContext = function () {
        return {
            getQueryRecycler: this.getQueryRecycler,
        };
    };
    QueryRecyclerProvider.prototype.render = function () {
        return React.Children.only(this.props.children);
    };
    QueryRecyclerProvider.propTypes = {
        children: PropTypes.element.isRequired,
    };
    QueryRecyclerProvider.contextTypes = {
        client: PropTypes.object,
    };
    QueryRecyclerProvider.childContextTypes = {
        getQueryRecycler: PropTypes.func.isRequired,
    };
    return QueryRecyclerProvider;
}(React.Component));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var invariant = require('invariant');
var ApolloProvider = (function (_super) {
    __extends$1(ApolloProvider, _super);
    function ApolloProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        invariant(props.client, 'ApolloClient was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
        return _this;
    }
    ApolloProvider.prototype.getChildContext = function () {
        return {
            client: this.props.client,
        };
    };
    ApolloProvider.prototype.render = function () {
        return (React.createElement(QueryRecyclerProvider, null, React.Children.only(this.props.children)));
    };
    ApolloProvider.propTypes = {
        client: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired,
    };
    ApolloProvider.childContextTypes = {
        client: PropTypes.object.isRequired,
    };
    return ApolloProvider;
}(React.Component));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MockLink = (function (_super) {
    __extends$3(MockLink, _super);
    function MockLink(mockedResponses) {
        var _this = _super.call(this) || this;
        _this.mockedResponsesByKey = {};
        mockedResponses.forEach(function (mockedResponse) {
            _this.addMockedResponse(mockedResponse);
        });
        return _this;
    }
    MockLink.prototype.addMockedResponse = function (mockedResponse) {
        var key = requestToKey(mockedResponse.request);
        var mockedResponses = this.mockedResponsesByKey[key];
        if (!mockedResponses) {
            mockedResponses = [];
            this.mockedResponsesByKey[key] = mockedResponses;
        }
        mockedResponses.push(mockedResponse);
    };
    MockLink.prototype.request = function (operation) {
        var key = requestToKey(operation);
        var responses = this.mockedResponsesByKey[key];
        if (!responses || responses.length === 0) {
            throw new Error("No more mocked responses for the query: " + printer.print(operation.query) + ", variables: " + JSON.stringify(operation.variables));
        }
        var original = this.mockedResponsesByKey[key].slice();
        var _a = this.mockedResponsesByKey[key].shift() || {}, result = _a.result, error = _a.error, delay = _a.delay, newData = _a.newData;
        if (newData) {
            original[0].result = newData();
            this.mockedResponsesByKey[key].push(original[0]);
        }
        if (!result && !error) {
            throw new Error("Mocked response should contain either result or error: " + key);
        }
        return new apolloLink.Observable(function (observer) {
            var timer = setTimeout(function () {
                if (error) {
                    observer.error(error);
                }
                else {
                    if (result)
                        observer.next(result);
                    observer.complete();
                }
            }, delay ? delay : 0);
            return function () {
                clearTimeout(timer);
            };
        });
    };
    return MockLink;
}(apolloLink.ApolloLink));
var MockSubscriptionLink = (function (_super) {
    __extends$3(MockSubscriptionLink, _super);
    function MockSubscriptionLink() {
        var _this = _super.call(this) || this;
        _this.unsubscribers = [];
        _this.setups = [];
        return _this;
    }
    MockSubscriptionLink.prototype.request = function () {
        var _this = this;
        return new apolloLink.Observable(function (observer) {
            _this.setups.forEach(function (x) { return x(); });
            _this.observer = observer;
            return function () {
                _this.unsubscribers.forEach(function (x) { return x(); });
            };
        });
    };
    MockSubscriptionLink.prototype.simulateResult = function (result) {
        var _this = this;
        setTimeout(function () {
            var observer = _this.observer;
            if (!observer)
                throw new Error('subscription torn down');
            if (result.result && observer.next)
                observer.next(result.result);
            if (result.error && observer.error)
                observer.error(result.error);
        }, result.delay || 0);
    };
    MockSubscriptionLink.prototype.onSetup = function (listener) {
        this.setups = this.setups.concat([listener]);
    };
    MockSubscriptionLink.prototype.onUnsubscribe = function (listener) {
        this.unsubscribers = this.unsubscribers.concat([listener]);
    };
    return MockSubscriptionLink;
}(apolloLink.ApolloLink));
function requestToKey(request) {
    var queryString = request.query && printer.print(request.query);
    var requestKey = {
        variables: request.variables || {},
        query: queryString,
    };
    return JSON.stringify(requestKey, Object.keys(requestKey).sort());
}
function mockSingleLink() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i] = arguments[_i];
    }
    return new MockLink(mockedResponses);
}
function mockObservableLink() {
    return new MockSubscriptionLink();
}

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MockedProvider = (function (_super) {
    __extends(MockedProvider, _super);
    function MockedProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        if (_this.props.client)
            return _this;
        var addTypename = !_this.props.removeTypename;
        var link = mockSingleLink.apply(null, _this.props.mocks);
        _this.client = new ApolloClient({ link: link, cache: new apolloCacheInmemory.InMemoryCache({ addTypename: addTypename }) });
        return _this;
    }
    MockedProvider.prototype.render = function () {
        return (React.createElement(ApolloProvider, { client: this.client || this.props.client }, this.props.children));
    };
    return MockedProvider;
}(React.Component));

exports.MockedProvider = MockedProvider;
exports.MockLink = MockLink;
exports.MockSubscriptionLink = MockSubscriptionLink;
exports.mockSingleLink = mockSingleLink;
exports.mockObservableLink = mockObservableLink;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=test-utils.js.map
