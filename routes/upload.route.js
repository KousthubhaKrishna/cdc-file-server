const express = require("express");
const router = express.Router();

const controller = require("../controller/fileUpload.controller");

let routes = (app) => {
  router.post("/files/upload-file/:company", controller.uploadFile)

  router.get("/files", controller.getFilesList)

  router.get("/files/:company", controller.getFilesListByCompany)

  router.get("/files/:name", controller.downloadFiles)

  router.get("/files/:company/:name", controller.downloadFilesByCompany)

  router.delete("/files/:company/:name", controller.deleteFilesByCompany)

  app.use(router);
};

module.exports = routes;
