import http from "k6/http";
import { sleep, check, fail } from "k6";
import execution from "k6/execution";

export const options = {
  vus: 10,
  duration: "10s",
};

export default function () {
  const username = `contoh${execution.vu.idInInstance}`;
  const loginRequest = {
    username: username,
    password: "rahasia",
  };

  const loginResponse = http.post(
    "http://localhost:3000/api/users/login",
    JSON.stringify(loginRequest),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  const checkLogin = check(loginResponse, {
    "login response status must 200": (response) => response.status === 200,
    "login response data must not null": (response) =>
      response.json().data.token != null,
  });

  if (!checkLogin) {
    fail(`Failed to login user-${username}`);
  }

  const loginBodyResponse = loginResponse.json();

  const currentResponse = http.get("http://localhost:3000/api/users/current", {
    headers: {
      Accept: "application/json",
      Authorization: loginBodyResponse.data.token,
    },
  });

  const checkCurrent = check(currentResponse, {
    "current response status must 200": (response) => response.status === 200,
    "current response data must not null": (response) =>
      response.json().data != null,
  });

  if (!checkCurrent) {
    fail(`Failed to get ${username}`);
  }
}
