// Implementation of different storage engines.

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

export { LocalStorageEngine };
