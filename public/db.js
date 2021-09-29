let db;

// open indexedDB for offline storage
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  const db = target.result;

  if (navigator.onLine) {
    checkDatabase();
  }

  const objectstore = db.createObjectStore("budget", { keypath: "__id" });
  objectstore.createIndex("value", "value");
};

request.onsuccess = (event) => {
  console.log(request.result);
  const db = request.result;

  const valueIndex = budgetStore.index("value");

  budgetStore.add({});
};

// function saveRecord(record) {
//   // create a transaction on the pending db with readwrite access
//   const transaction = db.transaction(["budget"], "readwrite");
//   // access your pending object store
//   const budgetStore = transaction.objectStore("budget");
//   // add record to your store with add method.
//   budgetStore.add({name: , value: populateTotal});
// }

// function checkDatabase() {
//   // open a transaction on your pending db
//   // access your pending object store
//   // get all records from store and set to a variable

//   getAll.onsuccess = function () {
//     if (getAll.result.length > 0) {
//       fetch("/api/transaction/bulk", {
//         method: "POST",
//         body: JSON.stringify(getAll.result),
//         headers: {
//           Accept: "application/json, text/plain, */*",
//           "Content-Type": "application/json",
//         },
//       })
//         .then((response) => response.json())
//         .then(() => {
//           // if successful, open a transaction on your pending db
//           // access your pending object store
//           // clear all items in your store
//         });
//     }
//   };
// }

// listen for app coming back online
window.addEventListener("online", checkDatabase);
