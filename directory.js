var express = require("express");
var app = express();
const fs = require("fs");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/newmessage", function (req, res) {
  res.status(200).sendFile(__dirname + "/newmessage.html");
});

app.post("/newmessage", function (req, res) {
  // Read the existing guestbook.json file
  fs.readFile('./guestbook.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading guestbook file.");
    }

    let guestbook = JSON.parse(data);

    // ID
    let newId = guestbook.length > 0 ? Number(guestbook[guestbook.length - 1].id) + 1 : 1;

    // Create a new entry
    let newEntry = {
      id: newId,
      name: req.body.name,
      country: req.body.country,
      message: req.body.message,
      date: new Date().toLocaleString()
    };

    //NEw entry push to the guestbook
    guestbook.push(newEntry);

    fs.writeFile('./guestbook.json', JSON.stringify(guestbook, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving guestbook entry.");
      }

      res.status(200).sendFile(__dirname + "/index.html");
    });
  });
});

app.get("/", function (req, res) {
  res.status(200).sendFile(__dirname + "/index.html");
});


app.get("/ajaxmessage", function (req, res) {
  res.status(200).sendFile(__dirname + "/ajaxmessage.html");
});

app.post("/ajaxmessage", function (req, res) {
  var name = req.body.ajaxname;
  var country = req.body.ajaxcountry;
  var message = req.body.ajaxmessage;

  // Respond back to the client
  res.send(`Received: ${name}, ${country}, ${message}`);
});


app.get("/guestbook", function (req, res) {
  fs.readFile('./guestbook.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading guestbook file.");
    }

    var guestbook = JSON.parse(data);

    //Bootstrap section
    var results = `
      <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <title>Guestbook</title>
      </head>
      <body>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-10">
              <h2 class="text-center my-4">Guestbook Entries</h2>
              <div class="text-center mb-4">
                <a href="http://localhost:8081/" class="btn btn-primary">Go to Homepage</a>
              </div>
              <table class="table table-bordered table-striped">
                <thead class="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
    `;

    //Generate table
    for (var i = 0; i < guestbook.length; i++) {
      results += `
        <tr>
          <td>${guestbook[i].id}</td>
          <td>${guestbook[i].name}</td>
          <td>${guestbook[i].country}</td>
          <td>${guestbook[i].message}</td>
        </tr>
      `;
    }

    results += `
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(guestbook);  // This will now show the latest data

    // Send the response with the full HTML including Bootstrap
    res.status(200).send(results);
  });
});



app.listen(8081, function () {
  console.log("Example app listening on port 8081");
});
