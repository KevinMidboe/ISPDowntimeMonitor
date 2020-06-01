
const createEvent = () => {
  const event = document.createElement('div')
  event.className = 'event';
  const tooltip = document.createElement('span');
  tooltip.className = 'tooltip';
  const tooltipContent = new Date().toLocaleString()
  tooltip.innerText = tooltipContent;

  event.appendChild(tooltip);
  return event;
}

function fetchUptimeAndGenerateBarGraph(instances=10) {
  const graph = document.getElementById('bar-graph');

  const event = createEvent()

  for (var i = instances; i >= 0; i--) {
    const clone = event.cloneNode(true)
    Math.random() > 0.95 ? clone.className += ' error' : null;
    graph.appendChild(clone)
  }
}


// fetchUptimeAndGenerateBarGraph(20)
fetchUptimeAndGenerateBarGraph(60)