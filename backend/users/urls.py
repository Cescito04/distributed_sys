from django.urls import path
from .views import UtilisateurListView

app_name = 'users'

urlpatterns = [
    path('users/', UtilisateurListView.as_view(), name='user-list'),
]

