const tableRowFromLog = (log, table, allLogs) => {
  const row = table.insertRow(0);
  row.setAttribute('incident-id', log._id)
  row.onclick = clickRowPopupIncident;
  row.insertCell(0).innerHTML = new Date(log.date).toLocaleString();
  row.insertCell(1).innerHTML = log.message;

  let duration = log['duration'] ? log.duration : '-';
  if (table.children.length > 1) {
    const prevEventId = table.children[1].getAttribute('incident-id');
    const prevEvent = allLogs.find(log => log._id == prevEventId)

    duration = (new Date(log.date) - new Date(prevEvent.date)) / 1000;
    if (duration < 600)                 // show as seconds up to 10 minutes
      duration = duration.toFixed(2).toString() + ' s'
    else if (duration < 3600)           // show as minutes up to 1 hours
      duration = (duration / 600).toFixed(2).toString() + ' m'
    else if (duration < 172800)         // show as hours up to 48 hours
      duration = (duration / 3600).toFixed(2).toString() + ' h'
    else if (duration < 604800)         // show as days up to 1 week
      duration = (duration / 86400).toFixed(2).toString() + ' d'
    else                                // show as week after 1 week
      duration = (duration / 604800).toFixed(2).toString() + ' w'
  }
  row.insertCell(2).innerHTML = duration;
}

const clickRowPopupIncident = (event) => {
  const cell = event.toElement;
  const row = cell.parentElement;
  const indicentId = row.getAttribute('incident-id');
  popover(indicentId)
}

function fetchLogsAndGenerateTable() {
  const table = document.getElementById('log-table');
  const tableBody = table.tBodies[0];

  fetch('/logs/alternating')
    .then(resp => resp.json())
    .then(indicentLogs => indicentLogs.map(log => tableRowFromLog(log, tableBody, indicentLogs)))
}

fetchLogsAndGenerateTable()