function createEntryObject (id, activity, notes, start, finish) {
  let object = {
    id: id,
    activity: activity,
    notes: notes,
    start: start,
    finish: finish
  }
  return object;
}

function pushEntryToLocalStorage (object) {
  localStorage.setItem(object.id, JSON.stringify(object));
  return true;
}

function allStorage() {
  let values = [];
  let keys = Object.keys(localStorage);
  let i = keys.length;

  while (i--) {
    values.push(localStorage.getItem(keys[i]));
  }

  return values;
}


function getEntriesArray () {
  let storage = allStorage();
  let entries = [];

  for (let i = 0; i < storage.length; i++) {
    try {
      let entry = JSON.parse(storage[i]);
      if (entry.start) {
        entries.push(entry[i]);
      }
    } catch {
      continue;
    }
  }

  return entries;
}

function queryEntry(id) {
  let entries = getEntriesArray();

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].id === id) {
      return entries[i];
    }
  }

  return false;
}

function updateEntry (id, attribute, value) {
  let entry = queryEntry(id);

  if (typeof attribute === 'string') {
    entry[attribute] = value;
  } else {
    if (attribute.length == value.length) {
      for (let i = 0; i < attribute.length; i++) {
        entry[attribute[i]] = value[i];
      }
    }
  }

  pushEntryToLocalStorage(entry);

  return entry;
}

function deleteEntry (id) {
  localStorage.removeItem(id);

  return true;
}

module.exports = {
  createEntryObject: createEntryObject,
  pushEntryToLocalStorage: pushEntryToLocalStorage,
  allStorage: allStorage,
  getEntriesArray: getEntriesArray,
  queryEntry: queryEntry,
  updateEntry: updateEntry,
  deleteEntry: deleteEntry
}
