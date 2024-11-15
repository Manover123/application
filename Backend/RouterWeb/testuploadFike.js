const express = require("express");
const Multer = require("multer");
const { FirebaseApp } = require("./firebase");
// const admin = require("firebase-admin");
const Loadimg = express();

// Loadimg.use(cors());
Loadimg.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storage = FirebaseApp.storage();
const bucket = storage.bucket();

Loadimg.post("/uploadFirbase", multer.single("file"), (req, res) => {
  const folder = "profile";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  blobStream.end(req.file.buffer);
});

module.exports = Loadimg;
