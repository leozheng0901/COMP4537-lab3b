// DISCLAIMER: This file was written with the help of ChatGPT
const http = require('http');
const dt = require('./modules/utils');
const url = require('url');
const language = require('./en.json');
const fs = require('fs');
const PORT = 8000;

function formatString(template, ...values) {
  return template.replace(/%(\d+)/g, (match, index) => {
    return values[index - 1]; // because %1 corresponds to values[0]
  });
}

class ServerApp {
  constructor(port) {
    this.port = port;
    this.language = language; // Save language configuration
    this.server = http.createServer((req, res) => this.handleRequest(req, res));
    this.server.listen(this.port, () => console.log(`Listening on ${this.port}...`));
  }


  // Main request handler that routes to specific methods
  handleRequest(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*"
    });
    const parsedURL = url.parse(req.url, true);
    const pathname = parsedURL.pathname;
    const date = dt.getDate();
    const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

    switch (trimmedPath) {
      case "":
        this.handleHome(req, res);
        break;
      case "getDate":
        this.handleGetDate(req, res, parsedURL, date);
        break;
      default:
        res.end("404 Not Found");
        break;
    }
  }

  // Renders the home page with forms for each endpoint
  handleHome(req, res) {
    res.end(`
      <form action="/getDate" method="GET">
        <fieldset>
          <legend>${this.language.nameLabel}</legend>
          <input type="text" name="name" id="name" placeholder="${this.language.name}" />
          <label for="name">${this.language.nameLabel}</label>
          <button type="submit">${this.language.nameAction}</button>
        </fieldset>
      </form>
    `);
  }

  // Handles the /getDate endpoint and returns a blue-colored message
  handleGetDate(req, res, parsedURL, date) {
    const name = parsedURL.query["name"];
    const message = formatString(this.language.greet, name);
    res.end(`<span style="color: blue;">${message} ${date}</span>`);
  }
}

// Instantiate the server
new ServerApp(PORT);
