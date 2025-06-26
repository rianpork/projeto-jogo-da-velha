from django.db import models

class GameResult(models.Model):
    # result é um campo de texto que armazena o resultado do jogo
    # Pode ser "x", "o" ou "empate"
    # created_at é um campo de data e hora que armazena quando o resultado foi criado
    result = models.CharField(max_length=100)
    createdat = models.DateTimeField(auto_now_add=True)