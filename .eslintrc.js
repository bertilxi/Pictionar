module.exports = {
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    sourceType: "module"
  },
  env: {
    es6: true,
    browser: true,
    node: true
  }
};
