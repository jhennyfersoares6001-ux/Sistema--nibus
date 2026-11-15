<script setup>
import { ref } from 'vue'
import { useSistemaStore } from '../stores/sistema.js'

const sistema = useSistemaStore()

const vazio = () => ({
  nome: '',
  turno: '',
  capacidade: null,
  horario: '',
  pontoEmbarque: '',
  rota: '',
})

const form = ref(vazio())
const bairrosTexto = ref('')
const editandoId = ref(null) // null = cadastrando, número = editando
const erro = ref('')

function ocupadas(id) {
  return sistema.alunos.filter((a) => a.onibusId === id).length
}

function salvar() {
  erro.value = ''
  const f = form.value

  if (!f.nome || !f.turno || !f.capacidade || !f.horario || !f.pontoEmbarque) {
    erro.value = 'Preencha nome, turno, capacidade, horário e ponto de embarque.'
    return
  }
  if (!Number.isInteger(f.capacidade) || f.capacidade < 1) {
    erro.value = 'A capacidade deve ser um número inteiro de pelo menos 1.'
    return
  }

  if (editandoId.value !== null) {
    const atual = sistema.linhas.find((l) => l.id === editandoId.value)
    const usadas = ocupadas(editandoId.value)
    if (f.capacidade < usadas) {
      erro.value = `Já existem ${usadas} alunos neste ônibus. A capacidade não pode ser menor que isso.`
      return
    }
    if (usadas > 0 && f.turno !== atual.turno) {
      erro.value = 'Não dá para mudar o turno enquanto houver alunos cadastrados neste ônibus.'
      return
    }
  }

  const dados = {
    ...f,
    bairros: bairrosTexto.value.split(',').map((b) => b.trim()).filter(Boolean),
  }

  if (editandoId.value === null) {
    sistema.adicionarOnibus(dados)
  } else {
    sistema.atualizarOnibus(editandoId.value, dados)
  }
  cancelar()
}

function editar(onibus) {
  editandoId.value = onibus.id
  form.value = { ...onibus }
  bairrosTexto.value = (onibus.bairros || []).join(', ')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelar() {
  editandoId.value = null
  form.value = vazio()
  bairrosTexto.value = ''
  erro.value = ''
}

function excluir(onibus) {
  if (!confirm(`Excluir ${onibus.nome}?`)) return
  const ok = sistema.excluirOnibus(onibus.id)
  if (!ok) {
    alert('Não dá para excluir: existem alunos cadastrados neste ônibus. Exclua ou mude esses alunos primeiro.')
  } else if (editandoId.value === onibus.id) {
    cancelar()
  }
}
</script>

<template>
  <h2>{{ editandoId === null ? 'Cadastro de ônibus' : 'Editar ônibus' }}</h2>

  <form @submit.prevent="salvar">
    <label>Nome do ônibus
      <input v-model="form.nome" type="text" placeholder="Ex.: Ônibus 01" />
    </label>

    <label>Turno
      <select v-model="form.turno">
        <option value="">Selecione</option>
        <option>Manhã</option>
        <option>Noite</option>
      </select>
    </label>

    <label>Capacidade (vagas)
      <input v-model.number="form.capacidade" type="number" min="1" placeholder="Ex.: 40" />
    </label>

    <label>Horário de saída
      <input v-model="form.horario" type="time" />
    </label>

    <label>Ponto de embarque
      <input v-model="form.pontoEmbarque" type="text" placeholder="Ex.: Praça central" />
    </label>

    <label>Bairros atendidos (opcional, separe por vírgula)
      <input v-model="bairrosTexto" type="text" placeholder="Ex.: Centro, Pindorama" />
    </label>

    <p v-if="erro" style="color: var(--perigo)">{{ erro }}</p>

    <button type="submit">
      {{ editandoId === null ? 'Cadastrar ônibus' : 'Salvar alterações' }}
    </button>
    <button
      v-if="editandoId !== null"
      type="button"
      class="btn-sec"
      @click="cancelar"
      style="margin-left: 8px"
    >
      Cancelar
    </button>
  </form>

  <h3>Ônibus cadastrados ({{ sistema.linhas.length }})</h3>

  <p v-if="sistema.linhas.length === 0">Nenhum ônibus cadastrado ainda.</p>

  <table v-else>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Turno</th>
        <th>Saída</th>
        <th>Embarque</th>
        <th>Vagas</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="o in sistema.linhas" :key="o.id">
        <td>{{ o.nome }}</td>
        <td>{{ o.turno }}</td>
        <td>{{ o.horario }}</td>
        <td>{{ o.pontoEmbarque }}</td>
        <td>{{ ocupadas(o.id) }} / {{ o.capacidade }}</td>
        <td>
          <button class="btn-sec" @click="editar(o)">Editar</button>
          <button class="btn-perigo" @click="excluir(o)" style="margin-left: 8px">
            Excluir
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>