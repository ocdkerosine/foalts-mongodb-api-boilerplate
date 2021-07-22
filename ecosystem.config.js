module.exports = {
  apps : [{
    name: "Agrific API",
    script: "./build/index.js",
    instances : "max",
    exec_mode : "cluster",
    kill_timeout : 20000,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}