"use client";
import axios from "axios";

let baseURL: string;

let token: string;

if (typeof window !== "undefined") {
  //PRODUCAO
  baseURL =
    window.location.protocol + "//" + window.location.hostname + ":8080";
  token = "Bearer " + localStorage.getItem("access_token");
} else {
  //DESENVOLVIMENTO
  baseURL = "";
  token = "";
}

const api = axios.create({
  baseURL: baseURL,

  headers: {
    Authorization: token,
  },
});

export default api;
