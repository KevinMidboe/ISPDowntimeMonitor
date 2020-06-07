
const clickEventPopupIncident = (event) => {
  const element = event.toElement;
  const indicentId = element.getAttribute('incident-id');
  popover(indicentId);
}

const createEvent = (event) => {
  const element = document.createElement('div')
  element.className = 'event';
  const tooltip = document.createElement('span');
  tooltip.className = 'tooltip';
  const tooltipContent = new Date(event.date).toLocaleString()
  tooltip.innerText = tooltipContent;

  element.setAttribute('incident-id', event._id)
  element.onclick = clickEventPopupIncident;

  element.appendChild(tooltip);
  return element;
}

function fetchUptimeAndGenerateBarGraph() {
  const graph = document.getElementById('bar-graph');

  fetch('/uptime')
    .then(resp => resp.json())
    .then(uptimeEvents => {
      uptimeEvents.map(event => {
        const eventElement = createEvent(event);
        if (event.isOk == false)
          eventElement.className += ' error'

        graph.appendChild(eventElement)
      })
    })
}

fetchUptimeAndGenerateBarGraph()