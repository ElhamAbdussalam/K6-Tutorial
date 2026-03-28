import { createContact } from "./helper/contact.js";
import { registerUser, loginUser } from "./helper/user.js";
import execution from "k6/execution";

export const options = {
  scenarios: {
    userRegistration: {
      exec: "userRegistration",
      executor: "shared-iterations",
      vus: 10,
      iterations: 200,
      maxDuration: "30s",
    },
    contactCreation: {
      exec: "contactCreation",
      executor: "constant-vus",
      vus: 10,
      duration: "10s",
    },
  },
};

export function userRegistration() {
  const uniqueId = new Date().getTime();
  const registerRequest = {
    username: `user-${uniqueId}`,
    password: "rahasia",
    name: "Elham",
  };

  registerUser(registerRequest);
}

export function contactCreation() {
  const number = (execution.vu.idInInstance % 9) + 1;
  const username = `contoh${number}`;
  const loginRequest = {
    username: username,
    password: "rahasia",
  };

  const loginResponse = loginUser(loginRequest);
  const token = loginResponse.json().data.token;

  const contact = {
    first_name: `Kontak`,
    last_name: `Contoh`,
    email: `contact@gmail.com`,
  };

  createContact(token, contact);
}
