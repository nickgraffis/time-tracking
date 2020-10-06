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
