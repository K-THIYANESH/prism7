const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "zlib": require.resolve("browserify-zlib"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser"),
        "path": require.resolve("path-browserify"),
        "util": require.resolve("util/"),
        "vm": require.resolve("vm-browserify"),
        "tty": require.resolve("tty-browserify"),
        "constants": require.resolve("constants-browserify"),
        "console": require.resolve("console-browserify"),
        "domain": require.resolve("domain-browser"),
        "querystring": require.resolve("querystring-es3"),
        "punycode": require.resolve("punycode"),
        "timers": require.resolve("timers-browserify"),
        "fs": false
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ]);
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
};
