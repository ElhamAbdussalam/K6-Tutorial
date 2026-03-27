import http from "k6/http";
import { sleep, check, fail } from "k6";
import execution from "k6/execution";

export const options = {
  vus: 10,
  duration: "10s",
};

export function setup() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      first_name: `Kontak`,
      last_name: `Ke-${i}`,
      email: `contact${i}@gmail.com`,
    });
  }
  return data;
}

export function getToken() {
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
  return loginBodyResponse.data.token;
}

export default function (data) {
  const token = getToken();
  for (let i = 0; i < data.length; i++) {
    const contact = data[i];
    const response = http.post(
      "http://localhost:3000/api/contacts",
      JSON.stringify(contact),
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      },
    );
    check(response, {
      "create contact status is 200": (response) => response.status === 200,
    });
  }
}

export function teardown(data) {
  console.info(`Finish create ${data.length} contacts`);
}
