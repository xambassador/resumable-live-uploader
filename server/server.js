const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const busboy = require("busboy");
const { promisify } = require("util");
const getFileInfo = promisify(fs.stat);

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

const getFilePath = (fileName, fileToken) =>
  `./uploads/upload-${fileToken}-${fileName}`;

app.post("/handshake", (req, res) => {
  if (!req.body || !req.body.fileName) {
    res.status(400).json({
      success: false,
      message: "Invalid request. Missing fileName in body.",
    });
    return;
  }

  const fileName = req.body.fileName;
  const fileToken = uuid.v4();
  fs.createWriteStream(getFilePath(fileName, fileToken), {
    flags: "w",
  });
  return res.status(200).json({
    message: "ok",
    token: fileToken,
    fileName,
    success: true,
  });
});

app.post("/upload", (req, res) => {
  const contentRange = req.headers["content-range"];
  const token = req.headers["x-file-token"];

  if (!contentRange) {
    return res.status(400).json({
      message: "Missing content-range header",
      success: false,
    });
  }

  if (!token) {
    return res.status(400).json({
      message: "Missing x-file-token header",
      success: false,
    });
  }

  // bytes=0-999/10000
  const isValidContentRange = contentRange.match(/bytes=(\d+)-(\d+)\/(\d+)/);
  if (!isValidContentRange) {
    return res
      .status(400)
      .json({ message: "Invalid content-range format", success: false });
  }

  const startingByte = Number(isValidContentRange[1]);
  const endingByte = Number(isValidContentRange[2]);
  const fileSize = Number(isValidContentRange[3]);

  if (
    startingByte >= fileSize ||
    startingByte >= endingByte ||
    endingByte <= startingByte ||
    endingByte > fileSize
  ) {
    return res.status(400).json({
      message: "Invalid content-range",
      success: false,
    });
  }

  const bb = busboy({ headers: req.headers });

  bb.on("error", (e) => {
    console.log("Failed to read file", e);
    return res.sendStatus(500);
  });

  bb.on("finish", () => {
    return res.sendStatus(200);
  });

  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    const filepath = getFilePath(filename, token);
    getFileInfo(filepath)
      .then((stats) => {
        if (stats.size !== startingByte) {
          return res.status(400).json({ message: "Bad Chunk Starting Byte" });
        }

        file
          .pipe(fs.createWriteStream(filepath, { flags: "a" }))
          .on("error", (e) => {
            console.log("Failed to upload file");
            return res
              .status(500)
              .json({ message: "Something is wrong", success: false });
          });
      })
      .catch((error) => {
        console.log("Failed to get file details", error);
        return res.status(404).json({
          message: "No file found with provided credentials",
          credentials: {
            token,
            filename,
          },
          success: false,
        });
      });
  });

  req.pipe(bb);
});

app.get("/upload-status", (req, res) => {
  if (!req.query || !req.query.token || !req.query.filename) {
    return res.status(400).json({
      message: "Missing token or fileName in query params",
      success: false,
    });
  }
  const { token, filename } = req.query;
  getFileInfo(getFilePath(filename, token))
    .then((stats) => {
      res.status(200).json({
        totalChunkUploaded: stats.size,
      });
    })
    .catch((error) => {
      console.log("Failed to get file details", error);
      return res.status(404).json({
        message: "No file found with provided credentials",
        credentials: {
          token,
          filename,
        },
        success: false,
      });
    });
});

app.delete("/delete-upload", (req, res) => {
  if (!req.query || !req.query.token || !req.query.filename) {
    return res.status(400).json({
      message: "Missing token or fileName in query params",
      success: false,
    });
  }

  const { token, filename } = req.query;
  const filepath = getFilePath(filename, token);

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Something is wrong",
        success: false,
      });
    }
    return res.status(200).json({
      message: "File removed successfully",
      success: false,
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});