const axios = require("axios");

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

// paste your access_token here (from /auth)
let TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZ293dGhhbTg5M0BnbWFpbC5jb20iLCJleHAiOjE3ODE2NzgwMjYsImlhdCI6MTc4MTY3NzEyNiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImM5NzY3MWM0LTFmZDktNDNkOC1hYzBiLTc5Mzk3OGFiODU0NiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Imdvd3RoYW0gciIsInN1YiI6IjFmN2IxMDQ2LTYxYTYtNDhkNi1iYjg0LWFiMGQ4M2M1M2VmMyJ9LCJlbWFpbCI6Imtnb3d0aGFtODkzQGdtYWlsLmNvbSIsIm5hbWUiOiJnb3d0aGFtIHIiLCJyb2xsTm8iOiIxMTMwMjMyNDMwMjgiLCJhY2Nlc3NDb2RlIjoianVGcGh2IiwiY2xpZW50SUQiOiIxZjdiMTA0Ni02MWE2LTQ4ZDYtYmI4NC1hYjBkODNjNTNlZjMiLCJjbGllbnRTZWNyZXQiOiJ1ZGJEZ0hzVEdDTmhmUGtDIn0.enio1aYztDvAwuSvSXThV0QA7Rc3Pbd6aPG8Q3WnfPk";

function setToken(newToken) {
  TOKEN = newToken;
}

const STACKS = ["backend", "frontend"];
const LEVELS = ["debug", "info", "warn", "error", "fatal"];
const BACKEND_PKGS = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
const FRONTEND_PKGS = ["api", "component", "hook", "page", "state", "style"];
const SHARED_PKGS = ["auth", "config", "middleware", "utils"];

async function Log(stack, level, pkg, message) {
  try {
    stack = stack.toLowerCase();
    level = level.toLowerCase();
    pkg = pkg.toLowerCase();

    const allowedPkgs = [
      ...SHARED_PKGS,
      ...(stack === "backend" ? BACKEND_PKGS : FRONTEND_PKGS),
    ];

    if (!STACKS.includes(stack)) throw new Error("Invalid stack: " + stack);
    if (!LEVELS.includes(level)) throw new Error("Invalid level: " + level);
    if (!allowedPkgs.includes(pkg)) throw new Error("Invalid package: " + pkg);

    const response = await axios.post(
      LOG_API,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    return response.data;
  } catch (err) {
    return null;
  }
}

module.exports = { Log, setToken };