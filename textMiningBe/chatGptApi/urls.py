from django.urls import include, path

from chatGptApi.views import ask_gpt, upload_file

urlpatterns = [
    # path('chatGptApi/', include('chatGptApi.urls')),
    
    path('upload', upload_file, name='upload_file'),
    path('ask', ask_gpt, name='ask_gpt'),

]