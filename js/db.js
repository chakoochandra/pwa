let dbPromised = idb.open("bolapedia", 1, function (upgradeDb) {
  let teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("name", "name", {
    unique: false
  });
});

function saveForLater(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      store.put(team);
      return tx.complete;
    })
    .then(function () {
      M.toast({ html: 'Klub berhasil disimpan.' });
      document.getElementById('save').style.display = 'none';
      document.getElementById('hapus').style.display = '';
    });
}

function deleteFavorite(id) {
  dbPromised.then(function (db) {
    let tx = db.transaction('teams', 'readwrite');
    let store = tx.objectStore('teams');
    store.delete(id);
    return tx.complete;
  }).then(function () {
    M.toast({ html: 'Klub berhasil dihapus.' });
    document.getElementById('hapus').style.display = 'none';
    document.getElementById('save').style.display = '';
  });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}

function getAllByTitle(title) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readonly");
      let store = tx.objectStore("teams");
      let titleIndex = store.index("name");
      let range = IDBKeyRange.bound(title, title + "\uffff");
      return titleIndex.getAll(range);
    })
    .then(function (teams) {
      console.log(teams);
    });
}

function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function (team) {
        resolve(team);
      });
  });
}
