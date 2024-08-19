
import io

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

from openai import OpenAI
from textMiningBe.settings import OPEN_API_KEY

import logging

# 로거 객체 생성
logger = logging.getLogger(__name__)

@csrf_exempt
def ask_gpt(request):
    if request.method == 'POST':
        logger.info(request)
        file = request.FILES['file']
        
        client = OpenAI(api_key=OPEN_API_KEY)

        prompt = """
        내가 운영하고 있는 어플에 대한 이번달 리뷰를 만족도(5단계)와 의견으로 나눠서 받았어. 첫번째로 만족도의 갯수를 새서 다른 문자 없이 json 결과만 아래와 같은 양식으로 똑같이 바꿔서 반환을 해줘 xAxis는 매우 만족, 만족, 보통, 불만족, 매우 불만족이고 yAxis 는 각 만족도별 갯수야
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
        두번째로 이번달 리뷰에서 많이 나온 의견을 바탕으로 어플의 긍정적인 부분과 부정적인 부분을 나눠서 전부 정리해서 알려줘. 모든 의견을 취합해줬으면 좋겠어 소수의 의견이라도 듣고 싶어.
        세번째로 너가 한 답변이 몇프로의 정확도를 가지고 있는 지 체크해서 왜 100프로 정확도가 아니라고 생각하는 지도 분석해줘.
        """

        # OpenAI 클라이언트 설정
        client = OpenAI(api_key=OPEN_API_KEY)

        # 파일을 OpenAI API가 처리할 수 있는 형식으로 변환
        file_bytes = file.read()
        file_name = file.name

        try:
            assistant = client.beta.assistants.create(
                name="Analyst Assistant",
                instructions="너는 분석 전문가야 내가 올려준 파일을 분석해서 한글로 결과를 도출해줘. 분석하다가 만족도와 의견이 상충되는 경우, 예를 들어 매우 만족인 데 부족한 점을 적은 경우와 같이 이런 경우에 있어서 만족도와 의견은 분리된다고 생각하고 답변해줘. 부족한 점이 있지만 매우 만족하고 있을 수 있잖아. ",
                model="gpt-4o",
                tools=[{"type": "file_search"}],
            )
            
            my_file = client.files.create(
                file=(file_name, io.BytesIO(file_bytes)),
                purpose="user_data"
            )
            
            thread = client.beta.threads.create(
                messages=[
                    {
                    "role": "user",
                    "content": prompt,
                    "attachments": [{ "file_id": my_file.id, "tools": [{"type": "file_search"}] }],
                    }
                ],

            )
            run = client.beta.threads.runs.create_and_poll(thread_id=thread.id, assistant_id=assistant.id)
            messages = list(client.beta.threads.messages.list(thread_id=thread.id, run_id=run.id))


            gpt_response = messages[0].content[0].text.value
            return JsonResponse({'gpt_response': gpt_response}, json_dumps_params={'ensure_ascii':False})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)
        
        

def create_new_thread():
    thread=OpenAI.beta.threads.create()
    return thread