<script setup>
import { ref } from 'vue'
import { useSistemaStore } from '../stores/sistema.js'

const sistema = useSistemaStore()

const vazio = () => ({ nome: '', telefone: '', cnh: '', onibusId: null })

const form = ref(vazio())
const editandoId = ref(null)
const erro = ref('')

function nomeDoOnibus(id) {
  const linha = sistema.linhas.find((l) => l.id === id)
  return linha ? `${linha.nome} (${linha.turno})` : '-'
}

function salvar() {
  erro.value = ''
  const f = form.value

  if (!f.nome || !f.telefone || !f.cnh || !f.onibusId) {
    erro.value = 'Preencha todos os campos.'
    return
  }

  if (editandoId.value === null) {
    sistema.adicionarMotorista({ ...f })
  } else {
    sistema.atualizarMotorista(editandoId.value, { ...f })
  }
  cancelar()
}

function editar(motorista) {
  editandoId.value = motorista.id
  form.value = { ...motorista }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelar() {
  editandoId.value = null
  form.value = vazio()
  erro.value = ''
}

function excluir(motorista) {
  if (confirm(`Excluir o motorista ${motorista.nome}?`)) {
    sistema.excluirMotorista(motorista.id)
    if (editandoId.value === motorista.id) cancelar()
  }
}
</script>

<template>
  <h2>{{ editandoId === null ? 'Cadastro de motorista' : 'Editar motorista' }}</h2>

  <form @submit.prevent="salvar">
    <label>Nome
      <input v-model="form.nome" type="text" />
    </label>

    <label>Telefone
      <input v-model="form.telefone" type="text" />
    </label>

    <label>CNH
      <input v-model="form.cnh" type="text" />
    </label>

    <label>Linha de ônibus
      <select v-model="form.onibusId">
        <option :value="null">{{ sistema.linhas.length ? 'Selecione' : 'Cadastre um ônibus primeiro' }}</option>
        <option v-for="linha in sistema.linhas" :key="linha.id" :value="linha.id">
          {{ linha.nome }} ({{ linha.turno }})
        </option>
      </select>
    </label>

    <p v-if="erro" style="color: var(--perigo)">{{ erro }}</p>

    <button type="submit">
      {{ editandoId === null ? 'Cadastrar' : 'Salvar alterações' }}
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

  <h3>Motoristas cadastrados ({{ sistema.motoristas.length }})</h3>

  <p v-if="sistema.motoristas.length === 0">Nenhum motorista cadastrado ainda.</p>

  <table v-else>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Telefone</th>
        <th>Linha</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="m in sistema.motoristas" :key="m.id">
        <td>{{ m.nome }}</td>
        <td>{{ m.telefone }}</td>
        <td>{{ nomeDoOnibus(m.onibusId) }}</td>
        <td>
          <button class="btn-sec" @click="editar(m)">Editar</button>
          <button class="btn-perigo" @click="excluir(m)" style="margin-left: 8px">
            Excluir
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>