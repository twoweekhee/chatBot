# Gpt chatBot
Open ai api 를 활용하여 파일을 업로드 하고 그 파일 기반으로 질문을 통한 데이터 분석 지원

# 파이썬 설치 및 장고 실행

```jsx
python3 -m venv myenv

source myenv/bin/activate //맥
.\myenv\Scripts\activate //윈도우

pip install django

django-admin --version

pip install django-environ

pip install django-cors-headers

pip install openai

python manage.py runserver

```

# E Chart 사용

[Apache ECharts](https://echarts.apache.org/en/index.html)

[Examples - Apache ECharts](https://echarts.apache.org/examples/en/editor.html?c=bar-simple)

### 예시 데이터

```jsx
option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};
```

### 적용 방법

```js
npm install echarts
-----

import * as echarts from 'echarts';


const chartDom = document.getElementById('main');
const myChart = echarts.init(chartDom);

myChart.setOption(chartOptions);
```

```html
<ChartContainer id="main" />
```
