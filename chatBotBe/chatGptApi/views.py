import json
import os
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
def upload_file(request):
    if request.method == 'POST' and 'file' in request.FILES:
        file = request.FILES['file']
        file_name = file.name

        # 파일을 저장할 경로
        file_path = os.path.join('uploads', file_name)
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # 파일 저장
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
            
        
        logger.info(f"File saved successfully at {file_path}")
        return JsonResponse({'status': 'success', 'message': f'{file_name} uploaded successfully!', 'file_path': file_path})
    logger.info("File saved fail at")
    return JsonResponse({'status': 'fail', 'message': 'File upload failed.'}, status=400)

@csrf_exempt
def ask_gpt(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        file_path = data.get('filePath')
        if not file_path:
            return JsonResponse({'error': 'File path not provided.'}, status=400)

        client = OpenAI(api_key=OPEN_API_KEY)

        prompt = """
        내가 운영하고 있는 어플에 대한 이번달 리뷰를 만족도(5단계)와 의견으로 나눠서 받았어. 키워드를 바탕으로 요약해서 정리해줘
        """

        try:
            response = client.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": file_path
                    },
                    {
                        "role": "user",
                        "content": prompt
                    },
                    {
                        "role": "user",
                        "content": "피드백이나 부정적인 의견 있으면 그거 취합해서 알려줄래?"
                    }
                ],
                max_tokens=2000,
            )

            gpt_response = response.choices[0].message["content"]
            return JsonResponse({'gpt_response': gpt_response})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)