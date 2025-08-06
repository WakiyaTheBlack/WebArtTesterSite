const path = require("path");

module.exports = {
    mode: "production",
    entry: "./index.js",
    devServer: {
        static: {
            directory: path.join(__dirname, '.')
        },
        port: 8080
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, '.')
    },
    module: {
        rules: [
            {
                test: /\.(frag|vert|glsl)$/i,
                use: 'raw-loader',
            }
        ]
    }
};
