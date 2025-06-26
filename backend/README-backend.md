
# Backend 
Este é o backend do projeto foi desenvolvido com Django REST Framework para armazenar e listar os resultados do jogo da velha.

## Como rodar o frontend (No terminal)

1. Acesse a pasta do backend:
-cd backend

2. Ative o ambiente virtual (venv):
-venv/Scripts/activate


3. instale as dependencias:
pip install djangorestframework django-cors-headers

4. Faça as migrações:
python manage.py migrate

5. Inicie o servidor:
python manage.py runserver

e acesse no navegador: http://localhost:8000


## Endpoints

-Endpoint POST /api/results/ para receber o resultado do jogo.
-Endpoint GET /api/results/ que retorna a lista de todos os resultados
salvos.


