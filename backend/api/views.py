from rest_framework.views import APIView
from rest_framework.response import Response
from .models import GameResult
from django.utils import timezone

class ListarResultados(APIView):
    # Função para listar resultados do jogo
    def get(self, request):
        # Essa função busca no banco de dados todos os resultados do jogo ordenados pelo resultado mais recente
        # e retorna uma lista de dicionários com o resultado em que foi salvo o resultado
        resultados = GameResult.objects.all().order_by('-createdat')
        lista_resultados = []
        for resultado in resultados:
            lista_resultados.append({
                'creadetat': timezone.localtime(resultado.createdat).strftime('%d/%m/%Y %H:%M'),
                'result': resultado.result
            })

        return Response(lista_resultados, status=200)
    
    def post(self, request):
        # Essa função recebe um resultado do jogo via POST, valida o campo 'result' e salva no banco de dados.
        data = request.data
        if 'result' not in data:
            return Response({'Erro: O campo result é obrigatório.'}, status=400)
        
        possiveis_resultados = ['X', 'O', 'Empate']
        if data['result'] not in possiveis_resultados:
            return Response({'Erro: O campo result deve ser X, O ou Empate'}, status=400)
        
        resultado = GameResult.objects.create(result=data['result'])
        resultado.save()
        resultado_retorno = { 
            'result': resultado.result,
            'createdat': timezone.localtime(resultado.createdat).strftime('%d/%m/%Y %H:%M')
        }
        return Response(resultado_retorno, status=201)