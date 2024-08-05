
import axios from "axios";

let baseURL: string;

if (typeof window !== 'undefined') {
  //PRODUCAO
  baseURL = window.location.protocol + "//" + window.location.hostname + ":8080";
} else {
  //DESENVOLVIMENTO
  baseURL = "";
}

const api = axios.create({
  baseURL: baseURL,

  headers: {

    Authorization: "Bearer " + localStorage.getItem("access_token") ,
    
  },
});

export default api;