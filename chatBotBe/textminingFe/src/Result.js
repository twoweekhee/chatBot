import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { apiClient } from './ApiClient';
import * as echarts from 'echarts';
import ReactMarkdown from 'react-markdown';

const Result = () => {
  const location = useLocation();
  const { file } = location.state || {}; 

  const [loading, setLoading] = useState(true);
  const [gptResponse, setGptResponse] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const [chartOptions, setChartOptions] = useState(null); 
  const MAX_LENGTH = 100; 

  useEffect(() => {
    if (file) {
      uploadFileAndAnalyze(file); 
    }
  }, [file]);

  useEffect(() => {
    if (chartOptions) {
      const chartDom = document.getElementById('main');
      const myChart = echarts.init(chartDom);

      myChart.setOption(chartOptions);

      return () => {
        myChart.dispose();
      };
    }
  }, [chartOptions]);

  const uploadFileAndAnalyze = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await apiClient.post('/chatGpt/ask', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 70000,
      });
      const fileContent = response.data.gpt_response; 
      console.log(fileContent);

      const jsonStart = fileContent.indexOf('{');
      const jsonEnd = fileContent.lastIndexOf('}') + 1;
      const jsonString = fileContent.substring(jsonStart, jsonEnd);
    
      const textContent = fileContent.substring(jsonEnd);
      
      try {
        const parsedOptions = JSON.parse(jsonString);
        setChartOptions(parsedOptions); 
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
      setGptResponse(removeMarkdown(textContent.trim())); 
    } catch (error) {
      console.error('Error uploading file:', error);
      setGptResponse('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

    // Markdown 문법을 제거하는 함수
    const removeMarkdown = (text) => {
      return text
        .replace(/[*#-]/g, '')  // *, #, - 문자 제거
        .replace(/(\[.*?\]\(.*?\))/g, '')  // [링크텍스트](URL) 형태 제거
        .replace(/`/g, '')  // 백틱 제거
        .replace(/^\s+|\s+$/g, '')  // 양끝 공백 제거
        .trim();  // 공백 제거
    };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <Container>
      <Title>결과 화면</Title>
      <ChartContainer id="main" />
      {loading ? (
        <LoadingMessage>로딩 중...</LoadingMessage>
      ) : (
        <ResultBox>
          <ResultMessage>
            {showFullText ? gptResponse : `${gptResponse.slice(0, MAX_LENGTH)}${gptResponse.length > MAX_LENGTH ? '...' : ''}`}
            {gptResponse.length > MAX_LENGTH && (
              <ShowMoreButton onClick={toggleShowFullText}>
                {showFullText ? '접기' : '더보기'}
              </ShowMoreButton>
            )}
          </ResultMessage>
        </ResultBox>
      )}
    </Container>
  );
};

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

const ChartContainer = styled.div`
  width: 600px;
  height: 500px;
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: gray;
`;

const ResultBox = styled.div`
  border: 2px solid green;
  border-radius: 15px;
  padding: 20px;
  max-width: 80%;
  background-color: #e6ffe6;
  margin-top: 20px; 
  box-sizing: border-box;
  max-height: 400px; /* 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 생성 */
`;

const ResultMessage = styled.div`
  font-size: 1rem;
  color: black;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ShowMoreButton = styled.button`
  margin-top: 10px;
  font-size: 1rem;
  color: green;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: darkgreen;
  }
`;
