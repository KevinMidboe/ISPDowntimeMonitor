
let indicentLogs = [
  {
    id: 1,
    date: new Date('2020/05/30 01:20:38').toISOString(),
    message: 'Vi har en feil i mobilnettet på denne adressen. Vi jobber med å løse problemet.',
    duration: '6d 4t 32min'
  }, {
    id: 2,
    date: new Date('2020/04/22 13:47:25').toISOString(),
    message: 'Vi har en feil i internett på denne adressen. Vi jobber med å løse problemet.',
    duration: '1d 2t 54min'
  }
]
indicentLogs = indicentLogs.reverse()

const newDiv = () => document.createElement('div');

const closePopover = () => document.getElementById('popover').remove();

const tableRowFromLog = (log, table) => {
  const row = table.insertRow(0);
  row.setAttribute('incident-id', log.id)
  row.onclick = clickRowPopupIncident;
  row.insertCell(0).innerHTML = log.date;
  row.insertCell(1).innerHTML = log.message;
  row.insertCell(2).innerHTML = log.duration;
}

const clickRowPopupIncident = (event) => {
  const cell = event.toElement;
  const row = cell.parentElement;
  const indicentId = row.getAttribute('incident-id');

  const popover = newDiv()
  const container = newDiv()
  popover.id = 'popover'
  popover.onclick = closePopover;
  container.className = 'container'
  container.innerText = Object.values(indicentLogs[indicentId]).join('\n')
  popover.appendChild(container)
  document.body.appendChild(popover);
}

function fetchLogsAndGenerateTable() {
  const table = document.getElementById('log-table');
  const tableBody = table.tBodies[0];

  indicentLogs.map(log => tableRowFromLog(log, tableBody))
}

fetchLogsAndGenerateTable()