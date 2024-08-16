import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { apiClient } from './ApiClient';
import Result from './Result';  // Result 컴포넌트 가져오기

function Home() {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      apiClient.post('chatGpt/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response);
        setFilePath(response.data.file_path)
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
    } else {
      alert('Please select a file first!');
    }
  };

  return (
    <Container>
      <Title>아이쿠카</Title>
      <FileUpload>
        <FileInput type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
        <UploadButton onClick={handleUpload}>Upload Excel File</UploadButton>
      </FileUpload>
      <ViewResultButton onClick={() => navigate('/result', { state: { filePath } })}>결과 보기</ViewResultButton>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.div`
  color: green;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const FileUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileInput = styled.input`
  margin-bottom: 10px;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: green;
`;

const ViewResultButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: green;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: gray;
  }
`;
