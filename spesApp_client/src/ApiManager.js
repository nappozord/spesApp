import { AsyncStorage } from "react-native";

let headers = {
  "Content-Type": "application/json",
};

const APISERVER_URL = 'https://spesapp.nappozord.tk/';

export const getToken = (setLogged) => {
  AsyncStorage.getItem("token").then((token) => {
    setLogged(true);
    //if (!token) {
    /*fetch(APISERVER_URL + "api/token/", {
      method: "POST",
      headers,
      body: JSON.stringify({
        username: "nappozord",
        password: "123qwe.123qwe...",
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.access && res.refresh) {
          headers["Authorization"] = "Bearer " + res.access;
          AsyncStorage.setItem("token", res.access);
          AsyncStorage.setItem("refresh", res.refresh);
        }
        setLogged(true);
      })
      .catch((e) => {
        setLogged(true);
        console.log(e)
      });*/
    //} else {
    //  headers["Authorization"] = "Bearer " + token;
    //  setLogged(true);
    //}
  });
};

export const getProducts = () => {
  fetch(APISERVER_URL + "products/", {
    method: "GET",
    headers,
  })
    .then((r) => r.json())
    .then((res) => console.log(res.body))
    .catch((e) => console.log(e));
};

export const putProduct = (product) => {
  fetch(APISERVER_URL + "products/" + product.name + "/", {
    method: "PUT",
    headers,
    body: JSON.stringify(product),
  }).catch((e) => console.log(e));
};

export const postProduct = (product) => {
  fetch(APISERVER_URL + "products/", {
    method: "POST",
    headers,
    body: JSON.stringify(product),
  }).catch((e) => console.log(e));
};

export const deleteProduct = (product) => {
  fetch(APISERVER_URL + "products/" + product + "/", {
    method: "DELETE",
    headers,
  }).catch((e) => console.log(e));
};

export const getLogs = (product) => {
  fetch(APISERVER_URL + "products/" + product + "/logs", {
    method: "GET",
    headers,
  })
    .then((r) => r.json())
    .then((res) => console.log(res.body))
    .catch((e) => console.log(e));
};

export const putLog = (product, log) => {
  fetch(
    APISERVER_URL + "products/" +
      product +
      "/logs/" +
      log.timeIn +
      "/",
    {
      method: "PUT",
      headers,
      body: JSON.stringify(log),
    }
  ).catch((e) => console.log(e));
};

export const postLog = (product, log) => {
  fetch(APISERVER_URL + "products/" + product + "/logs/", {
    method: "POST",
    headers,
    body: JSON.stringify(log),
  }).catch((e) => console.log(e));
};

export const getOptions = () => {
  fetch(APISERVER_URL + "options/", {
    method: "GET",
    headers,
  })
    .then((r) => r.json())
    .then((res) => console.log(res.body))
    .catch((e) => console.log(e));
};

export const putOptions = (options) => {
  fetch(APISERVER_URL + "options/", {
    method: "PUT",
    headers,
    body: JSON.stringify(options),
  }).catch((e) => console.log(e));
};

export const uploadCloud = () => {
  AsyncStorage.getItem("options")
    .then((ops) => {
      if (ops) {
        putOptions(JSON.parse(ops));
        AsyncStorage.getItem("products")
          .then((prods) => {
            JSON.parse(prods).forEach((p) => {
              putProduct(p);
              p.logs.forEach((l) => {
                putLog(p.name, l);
              });
            });
          })
          .catch((e) => console.log(e));
      }
    })
    .catch((e) => console.log(e));
};

export const downloadCloud = () => {};
