class InMemoryDB {
  constructor() {
    this.data = {};
    this.transactionInProgress = false;
    this.transactionData = {};
  }

  begin_transaction() {
    if (this.transactionInProgress) {
      throw new Error("Transaction already in progress");
    }
    this.transactionInProgress = true;
    this.transactionData = {};
  }

  put(key, val) {
    if (!this.transactionInProgress) {
      throw new Error("No transaction in progress");
    }
    this.transactionData[key] = val;
  }

  get(key) {
    return this.transactionInProgress && key in this.transactionData
      ? this.transactionData[key]
      : this.data[key] || null;
  }

  commit() {
    if (!this.transactionInProgress) {
      throw new Error("No transaction in progress");
    }
    Object.assign(this.data, this.transactionData);
    this.transactionData = {};
    this.transactionInProgress = false;
  }

  rollback() {
    if (!this.transactionInProgress) {
      throw new Error("No transaction in progress");
    }
    this.transactionData = {};
    this.transactionInProgress = false;
  }
}

// Testing the implementation
const inmemoryDB = new InMemoryDB();
console.log(inmemoryDB.get("A")); // null
// inmemoryDB.put("A", 5); // throws an error because a transaction is not in progress
inmemoryDB.begin_transaction();
inmemoryDB.put("A", 5);
console.log(inmemoryDB.get("A")); // null
inmemoryDB.put("A", 6);
inmemoryDB.commit();
console.log(inmemoryDB.get("A")); // 6
// inmemoryDB.commit(); // throws an error because there is no open transaction
// inmemoryDB.rollback(); // throws an error because there is no ongoing transaction
console.log(inmemoryDB.get("B")); // null
inmemoryDB.begin_transaction();
inmemoryDB.put("B", 10);
inmemoryDB.rollback();
console.log(inmemoryDB.get("B")); // null
