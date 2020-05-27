# ISPDowntimeMonitor
Monitor and notify if ISP reports any services for a given address non-operational. 

> Note! This is currently supported for addresses that have telenor as their ISP.

# Setup
If this is your first node project jump to Node and Yarn setup [below](#node-and-yarn-setup).

After the repo is cloned, navigate to it:

```bash
cd ISPDowntimeMonitor/
```

Install required packages:

```bash
yarn
```

## Config
To be notified when any services are down you need to fill in a gmail email and password and a recipient email address. 

Go to the ISP's page for checking service status by address https://www.telenor.no/privat/kundeservice/dmf/. After entering your address copy the pages url.

If my information was:
 - sender: no-reply@midboe.com
 - password: pass123
 - recipient: kevin@midboe.com
 - search url: https://www.telenor.no/privat/kundeservice/dmf/sok/168443300

then my config would look like:

```javascript
module.exports = {
  senderEmail: 'no-reply@midboe.com',
  senderPassword: 'pass123',
  recipientEmail: 'kevin@midboe.com',
  url: 'https://www.telenor.no/privat/kundeservice/dmf/sok/168443300',
  debug: false
}
```

Debug can be set to true for some more feedback about whats happening during execution.

## Usage 
To run the project use the `start` command defined in package.json:

```bash
yarn start
```

# Node and yarn setup
## Node
We need node to run our javascript and yarn as our package manager to install required javascript packages.
First check if you have node installed with by running `node -v` in your terminal.

If not check out nodejs.org's download page here: https://nodejs.org/en/download/package-manager/.

Ubuntu/raspberry pi users can add node to apt following these instructions: https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

## Yarn
To get yarn check their site for always up-to-date info here https://classic.yarnpkg.com/en/docs/install/#mac-stable.

One of the easiest ways to install Yarn on macOS and generic Unix environments is via our shell script. You can install Yarn by running the following code in your terminal:

```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```

We are done! Jump [back up](#setup) to continue project setup!

