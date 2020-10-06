function createActivityObject(id, camelCase, name) {
  let object = {
    id: id,
    camelCase: camelCase,
    name: name
  };
  return object;
}

function createActivity(object) {
  let activities = getActivitiesArray();
  activities.push(object);
  pushActivityToLocalStorage(activities);
  return object;
}

function pushActivityToLocalStorage(array) {
  localStorage.setItem('activities', JSON.stringify(array));
  return true;
}

function getActivitiesArray() {
  if (localStorage.getItem('activities')) {
    try {
      let activities = JSON.parse(localStorage.getItem('activities'));
      if (activities.length > 0) {
        return activities;
      } else {
        return [activities];
      }
    } catch {
      let activities = [localStorage.getItem('activities')];
      return activities;
    }
  } else {
    return [];
  }
}

function queryActivity(id) {
  let activities = getActivitiesArray();

  for (let i = 0; i < activites.length; i++) {
    if (activites[i].id === id) {
      return activites[i];
    }
  }

  return false;
}

function indexOfObject(array, attribute, value) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][attribute] === value) {
      return i;
    }
  }

  return -1;
}

function updateActivity (id, attribute, value) {
  let activites = getActivitiesArray();
  let index = indexOfObject(activites, 'id', id);
  console.log(index);
  if (typeof attribute === 'string') {
    activites[index][attribute] = value;
  } else {
    if (attribute.length == value.length) {
      for (let i = 0; i < attribute.length; i++) {
        activites[index][attribute[i]] = value[i];
      }
    }
  }
  pushActivityToLocalStorage(activities);

  return activities[index];
}

function deleteActivity(id) {
  let activites = getActivitiesArray();
  let index = indexOfObject(activites, 'id', id);
  activites.splice(index, 1);

  return true;
}

module.exports = {
  createActivityObject: createActivityObject,
  createActivity: createActivity,
  pushActivityToLocalStorage: pushActivityToLocalStorage,
  getActivitiesArray: getActivitiesArray,
  queryActivity: queryActivity,
  indexOfObject: indexOfObject,
  deleteActivity: deleteActivity,
  updateActivity: updateActivity
}
