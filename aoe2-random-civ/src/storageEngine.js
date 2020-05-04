// Implementation of different storage engines.

class StorageEngine {
  load() {
    // Load the data here.
  }
  save(civilizations) {
    // Save the data here.
    console.log(civilizations);
  }
}

class LocalStorageEngine extends StorageEngine {
  load() {
    return new Promise((resolve, reject) => {
      if (localStorage.civilizations !== undefined) {
        resolve(JSON.parse(window.localStorage.getItem("civilizations")));
      } else {
        reject("No config found in local storage.");
      }
    });
  }
  save(civilizations) {
    return new Promise((resolve) => {
      window.localStorage.setItem(
        "civilizations",
        JSON.stringify(civilizations)
      );
      resolve();
    });
  }
}

module.exports.LocalStorageEngine = LocalStorageEngine;
