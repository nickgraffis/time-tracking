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
