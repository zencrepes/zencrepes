const path = require("path");

module.exports = {
    module: {
        rules: [
            {
                test: /\.graphql$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'graphql-tag/loader'
                    },
                ]
            }
        ]
    }
};
