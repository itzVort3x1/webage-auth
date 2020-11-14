const express = require("express");
const BodyParser = require("body-parser");
const request = require("request");
const {
  static
} = require("express");
const https = require("https");
const app = express();
app.use(
  BodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const FirstName = req.body.fname;
  const LastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: FirstName,
        LNAME: LastName,
      },
    }, ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/b921c9f34d";

  const options = {
    method: "POST",
    auth: "kaustubh:<your mailchimp key>",
  };
  const requestt = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendfile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  requestt.write(jsonData);
  requestt.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("the server has started on port 3000");
});
