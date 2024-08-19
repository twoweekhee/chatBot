import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Home from './Home';
import Result from './Result';  // Result 컴포넌트 가져오기

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'goorm-sans-code';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2408@1.0/goorm-sans-code.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'goorm-sans-code', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />  {/* Result 페이지 라우트 추가 */}
      </Routes>
    </Router>
  );
}

export default App;
