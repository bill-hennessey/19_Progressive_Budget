let db;

// open indexedDB for offline storage
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  const db = target.result;

  if (navigator.onLine) {
    checkDatabase();
  }

  const objectstore = db.createObjectStore("budget", { keypath: "_id" });
  objectstore.createIndex("value", "value");
};

request.onsuccess = (event) => {
  console.log(request.result);
  const db = request.result;

  const valueIndex = budgetStore.index("value");

  budgetStore.add({});
};

window.addEventListener("online", checkDatabase);
