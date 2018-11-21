const sqlite3 = require('sqlite3');

class Sqlite3Database {

  constructor(db) {
    this.db = db;
  }

  static newDatabaseFromFile(file) {
    return new Promise((resolve, reject) => {
      let db = new sqlite3.Database(file, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(new Sqlite3Database(db));
      });
    });
  }

  checkForValidDatabase() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let statement = " select count(name) as count from sqlite_master where type='table' and name='images' or name='meals' or name='menus'";
        this.db.get(statement, (error, row) => {
          if (error) {
            console.log("Rejecting");
            reject(error);
            return;
          }

          if (!row || !row.count || row.count != 3) {
            console.log("resolving false");
            resolve(false); 
            return;
          }
          console.log("resolving validate");
          resolve(true);
        });
      });
    });
  }

  initializeNewDatabase() {
    debugger;
    console.log("init: " + JSON.stringify(this.db));
    return new Promise((resolve, reject) => {
      this.db.seralize(() => {
        console.log("starting seralizing");
        this.db.run("create table images (_id number primary key, name text, path text, image_url text)", (error) => {
          if (error) {
            console.log("Error 1");
            reject(error);
            return;
          }

          console.log("resolving initalize");
          resolve(true);
        });
      });
    });
  }
}

Sqlite3Database.newDatabaseFromFile(":memory:").then((db) => {
  let database = db; 
  console.log(JSON.stringify(database));
  debugger;
  database.initalizeNewDatabase().then((initalized) => {
    if (initalized) {
      console.log("Database initalized");
      database.checkForValidDatabase().then((isValid) => {
        console.log("Database valid: " + isValid);
      }).catch((error) => {
        console.log("Error fetching row: " + JSON.stringify(error));
      });
    }
  }).catch((error) => {
    console.log("Error initalizing database: " + JSON.stringify(error)); 
  });
}).catch((error) => {
  console.log("Error opening database: " + JSON.stringify(error));
});
