module.exports = {
  apps: [
    {
      name: "learnivers",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment-variable",
      },
    },
  ],
};
