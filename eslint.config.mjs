import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

// July 2026:  This will not be needed until all the eslint related libraries can be updated to Version 10

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "src/js/vendor/*.js",
    "src/js/mock-data/",
    "src/js/dispatcher/Dispatcher.js",
    "**/srcDeprecated",
]), {
    extends: compat.extends("airbnb"),

    plugins: {
        react,
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: babelParser,
        ecmaVersion: 5,
        sourceType: "module",
    },

    rules: {
        "array-bracket-spacing": [1, "never"],
        camelcase: [1],
        "class-methods-use-this": 0,
        "jsx-a11y/alt-text": 0,
        "jsx-a11y/anchor-has-content": 1,
        "jsx-a11y/anchor-is-valid": 1,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/heading-has-content": 1,
        "jsx-a11y/iframe-has-title": 1,
        "jsx-a11y/label-has-associated-control": 1,
        "jsx-a11y/label-has-for": 0,
        "jsx-a11y/mouse-events-have-key-events": 1,
        "jsx-a11y/no-autofocus": 1,
        "jsx-a11y/no-noninteractive-element-interactions": 1,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-quotes": 2,
        "linebreak-style": 0,
        "max-len": [0, 80, 4],
        "no-console": [0],
        "no-else-return": [0],
        "no-multi-spaces": [0],
        "no-multiple-empty-lines": [0],
        "no-plusplus": [0],
        "no-underscore-dangle": [0],
        "object-curly-newline": 0,

        "object-curly-spacing": [1, "always", {
            arraysInObjects: false,
            objectsInObjects: true,
        }],

        "operator-linebreak": [1, "after"],
        "padded-blocks": [1],
        "prefer-destructuring": 1,
        quotes: [1, "single", "avoid-escape"],
        radix: 0,
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react/button-has-type": 1,
        "react/destructuring-assignment": 0,
        "react/forbid-prop-types": 0,
        "react/indent-prop": 0,
        "react/jsx-first-prop-new-line": 0,
        "react/jsx-indent-props": 0,
        "react/jsx-no-bind": 1,
        "react/jsx-props-no-spreading": 1,
        "react/no-access-state-in-setstate": 1,
        "react/no-array-index-key": 1,
        "react/no-children-prop": 1,
        "react/no-did-mount-set-state": 0,
        "react/no-did-update-set-state": 0,
        "react/no-string-refs": 1,
        "react/no-unused-prop-types": 1,
        "react/jsx-no-useless-fragment": 0,
        "react/no-unused-state": 1,
        "react/prefer-stateless-function": 0,
        "react/prop-types": 1,
        "react/require-default-props": 0,
        "react/sort-comp": 1,

        "space-before-function-paren": [1, {
            anonymous: "always",
            named: "always",
        }],

        "space-in-parens": [1],
        "template-curly-spacing": ["warn", "never"],

        "react/jsx-filename-extension": [1, {
            extensions: [".js", ".jsx"],
        }],
    },
}]);
