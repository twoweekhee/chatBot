import React, { useState } from 'react';

function UploadCsv() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://localhost:8080/api/upload-csv', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('파일이 성공적으로 업로드되었습니다.');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
      });
  };

  return (
    <div style={styles.container}>
      <h2>CSV 파일 업로드</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} style={styles.fileInput} />
      <button style={styles.button} onClick={handleUpload}>
        업로드
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  fileInput: {
    margin: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UploadCsv;
