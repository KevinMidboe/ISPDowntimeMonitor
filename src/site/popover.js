const newDiv = () => document.createElement('div');
const newImage = () => document.createElement('img');
const newButton = () => document.createElement('button');
const newLink = () => document.createElement('a');
const newBold = () => document.createElement('b');
const newSpan = () => document.createElement('span');

const containerWithTitleAndMessage = (title, msg) => {
  const container = newDiv();
  const bold = newBold();
  const message = newSpan();
  bold.innerText = title + ': ';
  message.innerText = msg;

  container.appendChild(bold)
  container.appendChild(message)
  return container
}

const escapeKeyClosePopover = (event) => {
  if (event.keyCode === 27)
    closePopover()
}

const closePopover = (event=null) => {
  if (event == null || event.toElement.id == 'popover' || event.toElement.className.includes('close')) {
    document.getElementById('popover').remove()
    document.removeEventListener('keydown', escapeKeyClosePopover);
  }
};

const popover = (id) => {
  const outer = newDiv()
  const container = newDiv()
  let dismissButton = newButton()
  const image = newImage()
  const downloadLink = newLink()
  const downloadButton = newButton()

  outer.id = 'popover'
  outer.onclick = closePopover;
  container.className = 'container'
  dismissButton.className = 'close topLeft';
  dismissButton.innerText = 'X'
  dismissButton.onclick = closePopover;
  image.src = '/pdf/' + id
  downloadLink.download = 'rapport.pdf';
  downloadLink.href = '/pdf/' + id
  downloadButton.innerText = 'Download pdf';
  downloadLink.appendChild(downloadButton)

  container.appendChild(dismissButton)
  container.appendChild(downloadLink);
  container.appendChild(image);

  const centered = newDiv();
  centered.className = 'centered';
  dismissButton = newButton();
  dismissButton.className = 'close'
  dismissButton.innerText = 'close';
  centered.appendChild(dismissButton)
  container.appendChild(centered);

  outer.appendChild(container)
  document.body.appendChild(outer);

  document.addEventListener('keydown', escapeKeyClosePopover)

  fetch('/logs/' + id)
    .then(resp => resp.json())
    .then(async (log) => {
      container.prepend(containerWithTitleAndMessage('Filename', log.pdfFilename))
      container.prepend(containerWithTitleAndMessage('Status', log.isOk ? 'Ok' : 'Not ok'))
      container.prepend(containerWithTitleAndMessage('Date', new Date(log.date).toLocaleString()))
      container.prepend(containerWithTitleAndMessage('Message', log.message))

      downloadLink.download = log.pdfFilename
    })
}
