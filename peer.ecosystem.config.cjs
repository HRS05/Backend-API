module.exports = {
  apps: [
    {
      name: "peer-prod",
      script: "./peer.js",
      exec_mode: "fork",
      interpreter: "node@21.7.2",
      env: {
        NODE_ENV: "prod"
      }
    }
  ]
};
