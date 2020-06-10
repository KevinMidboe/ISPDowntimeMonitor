
const eventWidth = 16

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

const appendEventToParent = (event, parent) => {
  const eventElement = createEvent(event);
  if (event.isOk == false)
    eventElement.className += ' error'

  parent.appendChild(eventElement)
}

const getGraphWidth = () => {
    const graph = document.getElementById('bar-graph');
    return graph.offsetWidth;
}

let lastResizePoint = 0;
console.log('lastResizePoint', lastResizePoint)

function fetchUptimeAndGenerateBarGraph() {
  const graph = document.getElementById('bar-graph');
  const graphWidth = graph.offsetWidth;
  if (graphWidth < lastResizePoint + 100 && graphWidth > lastResizePoint - 100) {
    return
  }
  lastResizePoint = graphWidth;
  console.log('lastResizePoint', lastResizePoint)

  graph.innerHTML = '';
  const numberOfEventsToFillGraph = Math.floor(graphWidth / eventWidth);

  Array(numberOfEventsToFillGraph).fill().map(() => appendEventToParent({
    isOk: Math.random() > 0.2 ? true : false,
    date: new Date(),
    _id: Math.random()
  }, graph))

  return

  fetch('/uptime')
    .then(resp => resp.json())
    .then(uptimeEvents => uptimeEvents.map(event => appendEventToParent(event, graph)))
}

window.onresize = fetchUptimeAndGenerateBarGraph

fetchUptimeAndGenerateBarGraph()