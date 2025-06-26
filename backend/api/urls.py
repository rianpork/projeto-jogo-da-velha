from django.urls import path
from .views import ListarResultados

# Configura a URL para listar resultados
urlpatterns = [
    path("results/", ListarResultados.as_view())
]