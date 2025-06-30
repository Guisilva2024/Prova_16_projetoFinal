const API_URL = 'https://68378ec72c55e01d184a2bc6.mockapi.io/Tarefas';

// Carrega e exibe tarefas na tela e no console
async function carregarTarefas() {
  try {
    const resposta = await fetch(API_URL);
    const tarefas = await resposta.json();
    const divListaTarefas = document.getElementById('lista-tarefas');
    divListaTarefas.innerHTML = '';

    console.clear();
    console.log('--- Lista de Tarefas ---');

    tarefas.forEach(tarefa => {
      const classeConcluida = tarefa.concluida ? 'concluida' : '';
      const textoBotao = tarefa.concluida ? 'Desmarcar' : 'Concluir';

      divListaTarefas.innerHTML += `
        <div class="tarefa ${classeConcluida}" data-id="${tarefa.id}">
          <span class="texto-tarefa">${tarefa.descricao}</span>
          <div class="botoes-tarefa">
            <button class="botao-concluir" onclick="alternarConcluida('${tarefa.id}', ${tarefa.concluida})">${textoBotao}</button>
            <button class="botao-editar" onclick="abrirModal('${tarefa.id}')">Editar</button>
            <button class="botao-deletar" onclick="deletarTarefa('${tarefa.id}')">Deletar</button>
          </div>
        </div>
      `;

      console.log(`ID: ${tarefa.id} | Descrição: ${tarefa.descricao} | Concluída: ${tarefa.concluida}`);
    });
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
}

// Aqui pode alterar a tarefa para concluída ou não
async function alternarConcluida(id, estadoAtual) {
  try {
    const novoEstado = !estadoAtual;
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concluida: novoEstado })
    });
    const tarefaAtualizada = await resposta.json();

    console.log(`Tarefa ${novoEstado ? 'concluída' : 'desmarcada'}: ID ${tarefaAtualizada.id} | Descrição: ${tarefaAtualizada.descricao}`);
    carregarTarefas();
  } catch (error) {
    console.error('Erro ao atualizar estado da tarefa:', error);
  }
}

// Abre modal
async function abrirModal(id) {
  try {
    const tarefa = await carregarUmaTarefaSo(id);
    document.getElementById('modalEditar').style.display = 'flex';
    document.getElementById('editar-Id').value = tarefa.id;
    document.getElementById('editar-Descricao').value = tarefa.descricao;

    console.log(`Abrindo modal para editar tarefa: ID ${tarefa.id} | Descrição: ${tarefa.descricao}`);
  } catch (error) {
    console.error('Erro ao abrir tarefa:', error);
  }
}

function fecharModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

// Busca uma tarefa pelo id
async function carregarUmaTarefaSo(id) {
  const resposta = await fetch(`${API_URL}/${id}`);
  return await resposta.json();
}

// Atualiza tarefa 
async function alterarTarefa() {
  const id = document.getElementById('editar-Id').value;
  const descricao = document.getElementById('editar-Descricao').value;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao })
    });
    const tarefaAtualizada = await resposta.json();

    console.log(`Tarefa atualizada: ID ${tarefaAtualizada.id} | Nova descrição: ${tarefaAtualizada.descricao}`);

    fecharModal();
    carregarTarefas();
  } catch (error) {
    console.error('Erro ao alterar tarefa:', error);
  }
}

// Deleta a Tarefa
async function deletarTarefa(id) {
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    console.log(`Tarefa com ID ${id} deletada com sucesso.`);
    carregarTarefas();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
  }
}

// Adiciona Tarefa
async function adicionarTarefa() {
  const input = document.getElementById('entradaNovaTarefa');
  const descricao = input.value.trim();

  if (!descricao) {
    alert('Digite uma descrição para a tarefa.');
    return;
  }

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao, concluida: false })
    });
    const novaTarefa = await resposta.json();

    console.log(`Nova tarefa adicionada: ID ${novaTarefa.id} | Descrição: ${novaTarefa.descricao} | Concluída: ${novaTarefa.concluida}`);

    input.value = '';
    carregarTarefas();
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
  }
}

// No console
carregarTarefas();
