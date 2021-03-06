/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const apiRouter = require('./routes');
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const bodyParser = require("body-parser");

// Creates a client
const client = new vision.ImageAnnotatorClient();
const db = require('./models/db');
/**
 * App Variables
 */
const app = express();
const pretty = require('express-prettify');
//app.use(pretty());
const port = process.env.PORT || "8000";
var cnt = 0;
var str = "";

/**
 *  App Configuration
 */
 app.set("views", path.join(__dirname, "views"));
 app.set("view engine", "pug");
 app.use(express.static(path.join(__dirname, "public")));
 app.use(express.json());
/**
 * Routes Definitions
 */
 app.get("/", (req, res) => {
   res.render("index", { title: "Home" });
 });
 app.use(bodyParser.urlencoded({extended: false}));
 app.get("/user", (req, res) => {
  res.render("user", { title: "Upload", userProfile: { nickname: req.body.fname } });
});
app.post("/user", (req, res) => {
 str = req.body.fname;
 res.render("user", { title: "Upload", userProfile: { nickname: req.body.fname } });
});
app.use('/api/tests', apiRouter);

/*
* GCloud Vision Query
*/
async function storeImage(imgPath,author) {
  // Performs label detection on the image file
  // Read a local image as a text document
 const [result] = await client.documentTextDetection(imgPath);
 const fullTextAnnotation = result.fullTextAnnotation;
 //console.log(`${fullTextAnnotation.text}`);
 try{
    let results = await db.insert(null,author,fullTextAnnotation.text);
 }catch(e){
    console.log(e);
 }
}

/*
* Uploading Files
*/

const http = require("http");
const fs = require("fs");

const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./img"
});


app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    cnt++;
    const targetPath = path.join(__dirname, "./img/image"+cnt.toString()+".jpg");

    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);
        res.render("user", { title: "Upload", userProfile: { nickname: str } });
      });
      //Apply GCloud Vision
      storeImage(targetPath,str).catch(console.error);
      console.log(str);
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .jpg files are allowed!");
      });
    }
  }
);

/**
 * Server Activation
 */
 app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
//      quickStart();
});
