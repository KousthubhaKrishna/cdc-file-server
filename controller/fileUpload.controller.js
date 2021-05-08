const upload = require("../middleware/fileUpload");

const URL = process.env.CLIENT_URL || "http://localhost:8080/files/";
const fs = require("fs");

const DIR = './public/uploads/';
const uploadFile = async (req, res) => {
  try {
    const path = __basedir + "/public/uploads/";
    if (req.params.company && !fs.existsSync(path + req.params.company + '/')) {
      fs.mkdirSync(path + req.params.company + '/');
    } else if (!fs.existsSync(path + 'general/')) {
      fs.mkdirSync(path + 'general/')
    }

    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }

    res.status(200).send({
      message: "File uploaded successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const getFilesList = (req, res) => {
  const path = __basedir + "/public/uploads/";

  fs.readdir(path, function (err, files) {
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      filesList.push({
        name: file,
        url: URL + file,
      });
    });

    res.status(200).send(filesList);
  });
};

const getFilesListByCompany = (req, res) => {
  var path = __basedir + "/public/uploads/" + req.params.company + '/';

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];
    files.forEach((file) => {
      filesList.push({
        name: file,
        url: URL + req.params.company + '/' + file,
      });
    });

    res.status(200).send(filesList);
  });
};

const downloadFiles = (req, res) => {
  const fileName = req.params.name;
  const path = __basedir + "/public/uploads/";

  res.download(path + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
};

const downloadFilesByCompany = (req, res) => {
  const fileName = req.params.name;
  const path = __basedir + "/public/uploads/" + req.params.company + '/';

  res.download(path + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
};

const deleteFilesByCompany = (req, res) => {
  const fileName = req.params.name;
  const path = __basedir + "/public/uploads/" + req.params.company + '/';

  fs.unlinkSync(path + fileName);
  res.status(200).send({
    message: "File deleted - " + fileName,
  });
};

module.exports = { uploadFile, downloadFiles, downloadFilesByCompany, getFilesList, getFilesListByCompany, deleteFilesByCompany };