<script setup>
import { ref, computed } from 'vue'
import { useSistemaStore } from '../stores/sistema.js'

const sistema = useSistemaStore()

const vazio = () => ({
  nome: '',
  faculdade: '',
  curso: '',
  turno: '',
  bairro: '',
  endereco: '',
  onibusId: null,
})

const form = ref(vazio())
const erro = ref('')
const sucesso = ref(false)

const linhasDoTurno = computed(() =>
  sistema.linhas.filter((l) => l.turno === form.value.turno)
)

function salvar() {
  erro.value = ''
  sucesso.value = false
  const f = form.value

  if (!f.nome || !f.faculdade || !f.curso || !f.turno || !f.bairro || !f.endereco || !f.onibusId) {
    erro.value = 'Preencha todos os campos.'
    return
  }
  if (sistema.vagasDisponiveis(f.onibusId) <= 0) {
    erro.value = 'Este ônibus não tem mais vagas.'
    return
  }

  sistema.adicionarAluno({ ...f })
  form.value = vazio()
  sucesso.value = true
}
</script>

<template>
  <h2>Cadastro de aluno</h2>

  <form @submit.prevent="salvar">
    <label>Nome
      <input v-model="form.nome" type="text" />
    </label>

    <label>Faculdade
      <input v-model="form.faculdade" type="text" />
    </label>

    <label>Curso
      <input v-model="form.curso" type="text" />
    </label>

    <label>Turno
      <select v-model="form.turno" @change="form.onibusId = null">
        <option value="">Selecione</option>
        <option>Manhã</option>
        <option>Tarde</option>
        <option>Noite</option>
      </select>
    </label>

    <label>Bairro
      <input v-model="form.bairro" type="text" />
    </label>

    <label>Endereço
      <input v-model="form.endereco" type="text" />
    </label>

    <label>Ônibus
      <select v-model="form.onibusId" :disabled="!form.turno">
        <option :value="null">{{ linhasDoTurno.length ? 'Selecione' : 'Nenhum ônibus neste turno' }}</option>
        <option v-for="linha in linhasDoTurno" :key="linha.id" :value="linha.id">
          {{ linha.nome }} ({{ sistema.vagasDisponiveis(linha.id) }} vagas)
        </option>
      </select>
    </label>

    <p v-if="erro" style="color: red">{{ erro }}</p>
    <p v-if="sucesso" style="color: green">Cadastro realizado com sucesso!</p>

    <button type="submit">Cadastrar</button>
  </form>
</template>