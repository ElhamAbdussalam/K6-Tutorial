import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function () {
  http.get("http://localhost:3000/ping");
  sleep(1);
}
