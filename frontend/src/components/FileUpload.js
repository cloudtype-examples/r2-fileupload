const React = require("react");
const { useState } = require("react");
const { useDropzone } = require("react-dropzone");

import Axios from "axios";

require("dotenv").config();

const fileUploadEndpoint = process.env.REACT_APP_FILE_UPLOAD_ENDPOINT;
const fileDownloadEndpoint = process.env.REACT_APP_FILE_DOWNLOAD_ENDPOINT;

function FileUpload() {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await Axios.post(fileUploadEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileName = encodeURIComponent(file.name);
      const fileDownloadLink = `${fileDownloadEndpoint}/${fileName}`;

      setDownloadLink(fileDownloadLink);
      
      alert(`${fileName} 이 정상적으로 업로드 되었습니다.`);

    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("파일이 업로드 중 에러가 발생했습니다.");
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setDownloadLink(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <h1>스토리지 파일 업로드</h1>
      <div
        {...getRootProps()}
        style={{
          width: "100%",
          height: "200px",
          border: "2px dashed #ccc",
          textAlign: "center",
          lineHeight: "170px",
          marginBottom: "10px",
          background: isDragActive ? "#f5f5f5" : "white",
        }}
      >
        <input {...getInputProps()} />
        <p>
          드래그 앤 드롭으로 파일을 가져오거나 <strong>여기</strong>를 클릭해서
          파일을 선택해주세요
        </p>
      </div>
      <button
        onClick={() => document.querySelector('input[type="file"]').click()}
      >
        파일 선택
      </button>
      {file && (
        <div>
          <h3>업로드 할 파일:</h3>
          <p>{file.name}</p>
          <p>
            <button onClick={handleSubmit}>업로드</button>
          </p>
          <p>
            <button onClick={handleClearFile}>파일 선택 취소</button>
          </p>
        </div>
      )}
      {downloadLink && (
        <div>
          <h3>업로드한 파일 다운로드:</h3>
          <button onClick={() => window.open(downloadLink, "_blank")}>
            다운로드
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
