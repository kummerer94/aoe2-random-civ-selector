// Implementation of different storage engines.

import axios from "axios";

class StorageEngine {
  load() {
    // Load the data here.
  }
  save() {
    // Save the data here.
  }
}

class LocalStorageEngine extends StorageEngine {
  constructor() {
    super();
    this.localStorageKey = "civilizations";
  }

  load() {
    return new Promise((resolve, reject) => {
      if (localStorage[this.localStorageKey] !== undefined) {
        resolve(JSON.parse(window.localStorage.getItem(this.localStorageKey)));
      } else {
        reject("No pre-existing config found. Loading the default config.");
      }
    });
  }

  save(civilizations) {
    return new Promise((resolve) => {
      window.localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(civilizations)
      );
      resolve();
    });
  }
}

class APIStorageEngine extends StorageEngine {
  constructor() {
    super();

    this.client = axios.create({
      baseURL:
        import.meta.env.VUE_APP_STORAGE_API_URL ||
        "https://api.aoe-rcs.com/api",
    });
    this.client.defaults.headers.post["Content-Type"] = "application/json";
  }
  load(user) {
    return new Promise((resolve, reject) => {
      this.client
        .get("/load", {
          params: { user },
        })
        .then((resp) => {
          if (resp.data.civilizations === undefined) {
            reject(
              `Unable to find any configuration for the given usernmame "${user}".`
            );
          }
          resolve(resp.data.civilizations);
        })
        .catch((error) => reject(error));
    });
  }

  save(civilizations, user) {
    return new Promise((resolve, reject) => {
      this.client
        .post("/save", civilizations, {
          params: { user },
        })
        .then((resp) => resolve(resp.data))
        .catch((error) => reject(error));
    });
  }
}

export { LocalStorageEngine, APIStorageEngine };
