import { useState } from "react";
import axios from "axios";
import "./App.css";

// Aqui é criado o tabuleiro inicial, que é um array com 9 posições vazias
const TabuleiroInicial = Array(9).fill(null);

function App() {
  // Controla o tabuleiro do jogo
  const [tabuleiro, definirTabuleiro] = useState(TabuleiroInicial);
  // Guarda o proximo jogador
  const [xIsNext, definirTurnoX] = useState(true);
  // Guarda o vencedor
  const [vencedor, definirVencedor] = useState(null);
  // Define o jogador atual com base no estado xIsNext
  const JogadorAtual = xIsNext ? "X" : "O";
  // Guarda o erro caso ocorra
  const [erro, definirErro] = useState(null);

  const handleClick = (index) => {
    // Essa função é chamada quando um botão do tabuleiro é clicado
    if (tabuleiro[index] || vencedor) {
      // Se a célula já tiver sido clicada ou já houver um vencedor, não faz nada
      return;
    }

    // Faz uma cópia do tabuleiro
    const NovoTabuleiro = [...tabuleiro]
    // Salva a jogada do jogador atual na celula clicada
    NovoTabuleiro[index] = JogadorAtual

    // Verifica se tem um vencedor
    const NovoVencedor = calculaVencedor(NovoTabuleiro);

    // Atualiza o tabuleiro e troca o turno do jogador
    definirTabuleiro(NovoTabuleiro);
    definirTurnoX(!xIsNext);
    definirVencedor(NovoVencedor);

    if (NovoVencedor || NovoTabuleiro.every((cell) => cell)) {
      // Se já houver um vencedor ou todas as células estiverem clicadas salva o resultado
      const result = NovoVencedor || "Empate"

      // Envia o resultado para o Backend
      // Aqui foi preciso usar uma função assíncrona para poder exibir a mensagem de erro caso ocorra
      const salvarResultado = async () => {
        try {
          const resposta = await axios.post("http://localhost:8000/api/results/", { result: result });

        } catch (error) {
          if (error.response && error.response.data) {
            definirErro(error.response.data.detail || "Erro ao salvar resultado: " + error.message);
          } else {
            definirErro("Erro ao salvar resultado: " + error.message);
          }
        }
      };

      salvarResultado();
    }
  };

  // Função para reiniciar o jogo
  const reiniciarJogo = () => {
    // Limpa o tabuleiro
    definirTabuleiro(TabuleiroInicial); 
    // Começa com X novamente
    definirTurnoX(true);
    // Remove o vencedor
    definirVencedor(null);  
    // Limpa qualquer mensagem de erro
    definirErro(null);
  };

  const mensagemVencedor = vencedor
    ? `Vencedor: ${vencedor}`
    : `Próximo Jogador: ${JogadorAtual}`;

  // Renderiza o jogo na tela
  return (
    <div className="container">
      <h1>Jogo da Velha</h1>
      <h2 className="mensagem">{mensagemVencedor}</h2>

      {/* Renderiza o tabuleiro com os 9 botões */}
      <div className="tabuleiro">
        {tabuleiro.map((cell, index) => (
          <button key={index} className="cell" onClick={() => handleClick(index)}>
            {cell}
          </button>
        ))}
      </div>

      {/* Botão para reiniciar o jogo */}
      <button className="restart" onClick={reiniciarJogo}>
        Reiniciar
      </button>
      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}
    </div>
  )
}

// Função que verifica se existe um vencedor
function calculaVencedor(b) {
  // Todas as combinações possíveis para ganhar, sendo 3 linhas, 3 colunas e 2 diagonais
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Verifica se alguma linha foi completada por um único jogador
  for (let i = 0; i < lines.length; i++) {
    const [a, b_, c] = lines[i];
    if (b[a] && b[a] === b[b_] && b[a] === b[c]) {
      // Se a célula a, b e c forem iguais e não forem nulas, retorna o vencedor
      return b[a];
    }
  }
  // Se não houver vencedor, retorna null
  return null;
}

export default App;
