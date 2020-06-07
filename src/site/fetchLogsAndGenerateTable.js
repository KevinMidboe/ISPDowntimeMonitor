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
    if (duration > 600)
      duration = (duration / 60).toFixed(2).toString() + ' m'
    else
      duration = duration.toFixed(2).toString() + ' s'
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