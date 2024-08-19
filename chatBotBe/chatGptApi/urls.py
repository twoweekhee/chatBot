from django.urls import include, path

from chatGptApi.views import ask_gpt

urlpatterns = [
    # path('chatGptApi/', include('chatGptApi.urls')),
    
    path('ask', ask_gpt, name='ask_gpt'),

]