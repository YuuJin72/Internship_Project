import React, { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import { Button } from "@mui/material";
import axios from "axios";

function MuiFileUploader() {
  const [filesToUpload, setFilesToUpload] = useState([]);

  const handleFilesChange = (files) => {
    // Update chosen files
    setFilesToUpload([...files]);
  };

  const uploadFiles = () => {
    // Create a form and post it to server
    let formData = new FormData();
    filesToUpload.forEach((file) => formData.append("files", file));

    axios.post("http://localhost:8080/upload", {
      body: formData
    });
  };

  return (
    <>
      <FileUpload
        multiFile={true}
        onFilesChange={handleFilesChange}
        onContextReady={(context) => {}}
      />
      <Button onClick={uploadFiles} variant="contained" id="uploadButton">
        Upload
      </Button>
    </>
  );
}

export default MuiFileUploader
