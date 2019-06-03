const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

// Eventful model
const Eventful = require("../../models/Eventful");
const User = require("../../models/User");

// Validation
const validateEventfulInput = require("../../validation/eventful");
const validateCommentInput = require("../../validation/comment");

var multer = require("multer");

var fs = require("fs");
var path = require("path");

var btoa = require("btoa");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "../../../uploads"); //you tell where to upload the files,
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({
  storage: storage
}).array("file");

router.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// @route   POST api/eventfuls
// @desc    Create eventful
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    upload(req, res, err => {
        console.log("req.body!!!!!", req.body);
        const { errors, isValid } = validateEventfulInput(req.body);

        // Check Validation
        if (!isValid) {
          console.log(errors);
          // If any errors, send 400 with errors object
          return res.status(400).json(errors);
        }

        console.log("req.files!!!!!", req.files);
        if (err) {
          console.log(err);
          res.status(404).json({
            uploadFailed: "Upload failed"
          });
        } else {
          let newArr = [];

          for (let file of req.files) {
            let fileReadSync = fs.readFileSync(file.path);
            let item = {};
            item.image = {};
            item.image.data = fileReadSync;
            item.image.contentType = "img/png";
            newArr.push(item);

            fs.unlink(file.path, function(err) {
              if (err) {
                console.log("error deleting image", file.path);
              } else {
                console.log("deleted image", file.path);
              }
            });
          }
          for (var i = 0; i < newArr.length; i++) {
            var base64 = btoa(
              new Uint8Array(newArr[i].image.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            newArr[i].image.data = base64;
          }

          console.log("33333333333333333333", newArr);

          const newEventful = new Eventful({
            title: req.body.eventtitle,
            description: req.body.description,
            pictures: newArr,
            user: req.user.id,
            name: req.user.name
          });

          newEventful.save().then(eventful => res.json(eventful));
        }
        console.log("skipped....................");
      }
    );
  }
);