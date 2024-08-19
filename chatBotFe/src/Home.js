import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      navigate('/result', { state: { file } }); // 파일 객체를 Result 페이지로 전달
    } else {
      alert('Please select a file first!');
    }
  };

  return (
    <Container>
      <Title>아이쿠카</Title>
      <FileUploadBox>
        <FileInput type="file" onChange={handleFileChange} />
        <UploadButton onClick={handleUpload}>파일 업로드</UploadButton>
      </FileUploadBox>
    </Container>
  );
}

export default Home;

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
  font-size: 3rem;
  margin-bottom: 70px;
`;

const FileUploadBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid green;
  border-radius: 15px;
  padding: 20px;
  background-color: #f9f9f9;
`;

const FileInput = styled.input`
  margin-bottom: 10px;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: green;
  border-radius: 5px;
  border: 2px solid green;
  cursor: pointer;

  &:hover {
    background-color: #e6ffe6;
  }
`;
