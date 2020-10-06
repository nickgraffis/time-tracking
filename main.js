(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const act = require('./modules/activities.js');
const entry = require('./modules/entries.js');
const prototype = require('./modules/prototype.js');
const time = require('./modules/timer.js');
const help = require('./modules/helpers.js');
const math = require('matematik');
const dom = require('./modules/dom_helpers.js');

var interval;
var startTime;
var currentSecond = 0;
window.currentActivity = ' ';
var currentEntry = {};
const coolNames = [
  'Purple Tin Hound',
  'Einiosaurus Blues Zinc',
  'Fruitadens Classical Einsteinium',
  'Lobster Cooper Phoeniceous',
  'Shrimp Araguaia Sinopia',
  'King John King Cobra Ptarmigan',
  'Macbeth Boa Albatross',
  'Hamlet Corral Snake Puffin',
];

window.addActivity = function () {
  let newActivity = act.createActivityObject(
    math.getRandomInt(500),
    help.camelize(coolNames[math.getRandomInt(7)]),
    coolNames[math.getRandomInt(7)]
  );

  console.log(newActivity);

  let activityDiv = document.createElement('LI');
  activityDiv.innerHTML = eval('`' + prototype.getFile('templates/activity.html') + '`');
  document.getElementById('activities_list').appendChild(activityDiv);

  act.createActivity(newActivity);
}

window.updateActivityName = function (id) {
  console.log(id);
  let name = document.getElementById(id + '_name').value;
  let updatedActivity = act.updateActivity(id, ['name', 'camelCase'], [name, help.camelize(name)]);
}

window.addNotes = function (id) {
  updateEntry(id, 'notes', document.getElementById(id + '_notes_input').value);
}

function updateTime() {
  currentSecond = Date.now() - startTime;
  document.getElementById('currentTime').innerHTML = time.formattedTime(currentSecond);
  document.getElementById('active_time_entry').innerHTML = time.formattedTime(currentSecond);
}

window.startTimer = function(id) {
  if (window.currentActivity != ' ' && window.currentActivity != id) {
    stopTimer(window.currentActivity);
  }
  window.currentActivity = id;

  startTime = Date.now();

  let activityName = act.queryActivity(id).name;
  let entry = entry.createEntryObject(
    math.getRandomInt(100000000),
    activityName,
    '',
    startTime,
    null
  );

  document.getElementById(help.camelize(math.englishify(id)) +'_play').style.visibility = 'hidden';
  document.getElementById(help.camelize(math.englishify(id)) +'_stop').style.visibility = 'visible';
  document.getElementById(help.camelize(math.englishify(id)) + '_link').setAttribute('onclick','stopTimer("' + help.camelize(math.englishify(id)) + '")');

  clearInterval(interval);
  interval = setInterval(updateTime, 1000);

  let time = document.createElement('DIV');
  time.innerHTML = `<div id="${help.camelize(math.englishify(id))}_time" style="padding: 8px;">
      <span class="has-text-link has-text-weight-bold" id="currentTime">00h00min00sec</span>
    </div>
    <div id="${help.camelize(math.englishify(id))}_notes" style="padding: 8px;">
      <input id="${help.camelize(math.englishify(id))}_notes_input" onkeyup="addNotes('${help.camelize(math.englishify(id))}')" class="input" type="text" style="border: none; box-shadow: none; background-color: transparent; padding: 0;" placeholder="eg. Responding to customer comments.">
    </div>`;

  document.getElementById(activity).appendChild(time);
  let entryDiv = document.createElement('DIV');
  entryDiv.classList = 'box';
  entryDiv.innerHTML = eval('`' + prototype.getFile('templates/card.html') + '`');
  document.getElementById('list_of_entries').appendChild(entryDiv);
}

window.stopTimer = function (id) {
  clearInterval(interval);
  document.getElementById(help.camelize(math.englishify(id)) + '_play').style.visibility = 'visible';
  document.getElementById(help.camelize(math.englishify(id)) + '_stop').style.visibility = 'hidden';
  document.getElementById(help.camelize(math.englishify(id)) + '_time').remove();
  document.getElementById(help.camelize(math.englishify(id)) + '_notes').remove();
  document.getElementById(help.camelize(math.englishify(id)) + '_link').setAttribute('onclick','startTimer("' + help.camelize(math.englishify(id)) + '")');
  currentSecond = 0;
  startTime = null;
  currentActivity = ' ';

  entry.updateEntry(id, 'finish', Date.now());
}

prototype.createEnviornment();

},{"./modules/activities.js":2,"./modules/dom_helpers.js":3,"./modules/entries.js":4,"./modules/helpers.js":5,"./modules/prototype.js":6,"./modules/timer.js":7,"matematik":8}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

module.exports = {
  camelize: camelize
}

},{}],6:[function(require,module,exports){
const entry = require('./entries.js');
const time = require('./timer.js');
const act = require('./activities.js');
const math = require('matematik');
const help = require('./helpers.js');

function createEnviornment () {
  createEntriesList();
  createActivitiesList();
}


/* Get a file from directory and return it as a string*/
function getFile(file) {
  var x = new XMLHttpRequest();
  x.open('GET', file, false);
  x.send();
  return x.responseText;
}

function createEntriesList () {
  let targetDiv = document.getElementById('list_of_entries');
  let entries = entry.getEntriesArray();
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];
        let entryDiv = document.createElement('DIV');
        entryDiv.classList = 'box';
        entryDiv.innerHTML = `
        <article class="media">
        <div class="media-left">
        <figure class="image is-64x64">
          <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
        </figure>
        </div>
        <div class="media-content">
        <div class="content">
          <p>
            <strong>${entry.activity}</strong> <small>@nickgraffis</small> <small id="">${time.formattedTime(entry.finish - entry.start)}</small>
            <br>
            ${entry.notes}
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item" aria-label="reply">
              <span class="icon is-small">
                <i class="fas fa-reply" aria-hidden="true"></i>
              </span>
            </a>
            <a class="level-item" aria-label="retweet">
              <span class="icon is-small">
                <i class="fas fa-retweet" aria-hidden="true"></i>
              </span>
            </a>
            <a class="level-item" aria-label="like">
              <span class="icon is-small">
                <i class="fas fa-heart" aria-hidden="true"></i>
              </span>
            </a>
          </div>
        </nav>
        </div>
        </article>`;
        targetDiv.appendChild(entryDiv);
  }
}

function createActivitiesList () {
  let activities = act.getActivitiesArray();
  if (activities) {
    for (let i = 0; i < activities.length; i++) {
      let listEntry = document.createElement('LI');
      let newActivity = activities[i];
      listEntry.id = math.englishify(newActivity.id);
      listEntry.innerHTML = eval('`' + getFile('templates/activity.html') + '`');
      document.getElementById('activities_list').appendChild(listEntry);
    }
  }
}

module.exports = {
  createEnviornment: createEnviornment,
  getFile: getFile
}

},{"./activities.js":2,"./entries.js":4,"./helpers.js":5,"./timer.js":7,"matematik":8}],7:[function(require,module,exports){
function formattedTime(time) {
  var secondsShow = Math.floor((time / 1000)) % 60;
  var secondsCalc = Math.floor((time) / 1000);
  var min = Math.floor(secondsCalc / 60);
  var h = Math.floor(min / 60);
  if (secondsShow < 10) {
    var seconds = `0${secondsShow}`;
  } else {
    var seconds = `${secondsShow}`;
  }
  if (min < 10) {
    var minutes = `0${min}`;
  } else {
    var minutes = `${min}`;
  }
  if (h < 10) {
    var hours = `0${h}`;
  } else {
    var hours = `${h}`;
  }
  return `${hours}h${minutes}min${seconds}sec`;
}

module.exports = {
  formattedTime: formattedTime
}

},{}],8:[function(require,module,exports){
module.exports = {
    euclideanDistance : euclideanDistance,
    mean: mean,
    meanPoint: meanPoint,
    rangeOf: rangeOf,
    rangesOf: rangesOf,
    englishify: englishify,
    getRandomInt: getRandomInt,
    dot: dot,
    zeros: zeros,
};

/**
* Create a matrix filled with zeros of a certain height and width
* @param {Number} columns - integer - 2
* @param {Number} rows - integer - 2
* @return {Array{Array}} array - [[0, 0], [0, 0]]
*/
function zeros (columns, rows) {
  var matrix = [];
  var rowMatrix = [];
  for (let i = 0; i < columns; i++) {
      rowMatrix = [];
    for (let k = 0; k < rows; k++) {
      rowMatrix.push(0);
    }
    matrix.push(rowMatrix);
  }
  return matrix;
}

/**
* Compute the dot product of two vecors
* @param {Array} vector1
* @param {Array} vector2
* @return {Number} integer
* TODO Allow for 2-D arrays with a matrix returned
*/
function dot(vector1, vector2) {
  let result = 0;
  if (typeof vector1 === 'object') {
    if (typeof vector2 === 'object' && vector2.length === vector1.length) {
      for (var i = 0; i < vector1.length; i++) {
        result += vector1[i] * vector2[i];
      }
    } else {
      throw 'Error finding dot product of vectors of different dimensions!';
    }
  } else if (typeof vector2 === 'object') {
    throw 'Error finding dot product of vectors of different dimensions!';
  } else {
    result = vector1 * vector2;
  }
  return result;
}

/**
* Find a random integer between min and max value
* @param {Number} max - integer
* @param {Number} min - integer
* @return {Number} integer - will be between 0 and max
*/
function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Accept an integer and parse it out into an english string of the same meaning
* @param {Number} num - integer - 293
* @return {'Number'} string - two hundred and ninety three
* TODO Expand beyond 9999
* TODO Allow for negative numbers
* TODO Allow for floating points
*/
function englishify(num){
  var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
              'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
              'seventeen', 'eighteen', 'nineteen'];
  var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty',
              'ninety'];

  var numString = num.toString();

  if (num < 0) {
    throw 'Negative numbers are not supported.';
  }

  if (num === 0) {
    return 'zero';
  }

  //One to Twenty
  if (num < 20) {
    return ones[num];
  }
  //Twenty One to Ninety Nine
  if (numString.length === 2) {
    return tens[numString[0]] + ' ' + ones[numString[1]];
  }

  //100 Plus
  if (numString.length == 3) {
    if (numString[1] === '0' && numString[2] === '0')
      return ones[numString[0]] + ' hundred';
    else
      return ones[numString[0]] + ' hundred and ' + englishify(+(numString[1] + numString[2]));
  }

  if (numString.length === 4) {
    var end = +(numString[1] + numString[2] + numString[3]);
    if (end === 0) return ones[numString[0]] + ' thousand';
    if (end < 100) return ones[numString[0]] + ' thousand and ' + englishify(end);
    return ones[numString[0]] + ' thousand ' + englishify(end);
  }
}

/**
* Find a euclidean distance between two points
* @param {Array} a - first point on graph of dimensions N
* @param {Array} b - second point on graph of dimensions N
* @return {Number} integer
*/
function euclideanDistance(a, b) {
    if (a.length != b.length) {
        throw 'Error calculating Euclidean distance. Input vectors must have same number of dimensions!';
    }
    var sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(b[i] - a[i], 2);
    }
    return Math.sqrt(sum);
}

/**
* Calculates the mean value of a one-dimensional dataset
* @param {Array} data - data set
* @return {Number} mean value of data set
*/
function mean(data) {
    return data.reduce((total,current) => total += current, 0) / data.length;
}

/**
* Calculates the mean point of an n-dimensional dataset
* @param {Array} data - data set
* @return {Array} mean point of data set
*/
function meanPoint(data) {
    var theMeanPoint = [];
    if (data.length != 0) {
        for (let i = 0; i < data[0].length; i++) {
            theMeanPoint.push(mean(data.map(x => x[i])));
        }
    }
    return theMeanPoint;
}

/**
* Calculates the range of a one-dimensional data set
* @param {Array} data - data set
* @return {Number} range - range of the data set
*/
function rangeOf(data) {
    return data.reduce(function(total,current) {
        if (current < total.min) { total.min = current; }
        if (current > total.max) { total.max = current; }
        return total;
    }, {min: data[0], max: data[0]});
}

/**
* Calculates the ranges of each 'component' in an n-dimensional data set
* @param {Array} data - data set
* @return {Number} range - range of the data set
*/
function rangesOf(data) {
    var ranges = [];
    for (let i = 0; i < data[0].length; i++) {
        ranges.push(rangeOf(data.map(x => x[i])));
    }
    return ranges;
}

},{}]},{},[1]);
