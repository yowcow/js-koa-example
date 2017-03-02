module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-unused-vars": [
          "error",
          { "argsIgnorePattern": "^_" }
        ],
        "quotes": [
            "error",
            "double"
        ],
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "semi": [
            "error",
            "never"
        ]
    }
};
