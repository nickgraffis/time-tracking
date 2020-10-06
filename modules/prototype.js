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
