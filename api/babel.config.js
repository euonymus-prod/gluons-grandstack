const presets = [
  [
    "@babel/env",
  ],
];
const env = {
  "production": {
    "plugins": [
      "@babel/plugin-proposal-class-properties"
    ]
  },
  "development": {
    "plugins": [
      "@babel/plugin-proposal-class-properties"
    ]
  }
}

module.exports = { presets, env };
