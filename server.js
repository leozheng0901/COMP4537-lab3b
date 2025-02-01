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
      case "writeFile":
        this.handleWriteFile(req, res, parsedURL);
        break;
      case "readFile":
        this.handleReadFile(req, res, parsedURL);
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
      <form action="/writeFile" method="GET">
        <fieldset>
          <legend>${this.language.writeLabel}</legend>
          <input type="text" name="message" id="message" placeholder="${this.language.writeMessage}" />
          <label for="message">${this.language.writeLabel}</label>
          <button type="submit">${this.language.writeAction}</button>
        </fieldset>
      </form>
      <form action="/readFile" method="GET">
        <fieldset>
          <legend>${this.language.readLabel}</legend>
          <input type="text" name="file" id="file" placeholder="${this.language.readMessage}" />
          <label for="file">${this.language.readLabel}</label>
          <button type="submit">${this.language.readAction}</button>
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

  // Handles the /writeFile endpoint by appending content to a file
  handleWriteFile(req, res, parsedURL) {
    const content = parsedURL.query["message"];
    fs.appendFile("file.txt", content, (err) => {
      if (err) {
        return res.end("Uh oh error, not poggers");
      }
      return res.end("File update updated, POGGERS!");
    });
  }

  // Handles the /readFile endpoint by reading a file's contents
  handleReadFile(req, res, parsedURL) {
    const file = parsedURL.query["file"];
    fs.readFile(file, (err, data) => {
      if (err) {
        return res.end(file + " 404 Not Found!");
      }
      return res.end(data);
    });
  }
}

// Instantiate the server
new ServerApp(PORT);
