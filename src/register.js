import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
};

export default function () {
  const uniqueId = new Date().getTime();
  const body = {
    username: `user-${uniqueId}`,
    password: "rahasia",
    name: "user",
  };

  http.post("http://localhost:3000/api/users", JSON.stringify(body), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
