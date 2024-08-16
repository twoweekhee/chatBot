import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { apiClient } from './ApiClient';

const Result = () => {
  const location = useLocation();
  const { filePath } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [gptResponse, setGptResponse] = useState('');

  useEffect(() => {
    console.log(filePath);
    if (filePath) {
      askGpt(filePath);
    }
  }, [filePath]);

  const askGpt = async (path) => {
    try {
      const response = await apiClient.post('/chatGpt/ask', { filePath: path });
      console.log(response.data);
      setGptResponse(response.data.gpt_response);
    } catch (error) {
      console.error('Error requesting GPT:', error);
      setGptResponse('GPT 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>결과 화면</Title>
      {loading ? (
        <LoadingMessage>로딩 중...</LoadingMessage>
      ) : (
        <ResultMessage>{gptResponse}</ResultMessage>
      )}
    </Container>
  );
}

export default Result;

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

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: gray;
`;

const ResultMessage = styled.div`
  font-size: 1.5rem;
  color: black;
  text-align: center;
  white-space: pre-wrap; /* 유지: 여러 줄 응답을 보여줄 수 있도록 함 */
`;
