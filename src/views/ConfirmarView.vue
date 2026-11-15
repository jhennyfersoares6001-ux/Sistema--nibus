<script setup>
import { ref, computed } from 'vue'
import { useSistemaStore } from '../stores/sistema.js'

const sistema = useSistemaStore()
const alunoId = ref(null)

const aluno = computed(() => sistema.alunos.find((a) => a.id === alunoId.value))
const status = computed(() => (aluno.value ? sistema.usoDeHoje(aluno.value) : null))
</script>

<template>
  <h2>Confirmação diária</h2>

  <p v-if="sistema.alunos.length === 0">
    Nenhum aluno cadastrado. Faça o cadastro primeiro.
  </p>

  <div v-else>
    <label>Quem é você?
      <select v-model="alunoId">
        <option :value="null">Selecione seu nome</option>
        <option v-for="a in sistema.alunos" :key="a.id" :value="a.id">
          {{ a.nome }}
        </option>
      </select>
    </label>

    <div v-if="aluno" class="cartao">
      <p>
        Hoje:
        <strong v-if="status === true" style="color: green">vou usar o ônibus</strong>
        <strong v-else-if="status === false" style="color: red">não vou usar</strong>
        <strong v-else>ainda não confirmado</strong>
      </p>

      <button @click="sistema.confirmarUso(aluno.id, true)">Vou usar</button>
      <button @click="sistema.confirmarUso(aluno.id, false)" style="margin-left: 8px">
        Não vou usar
      </button>
    </div>
  </div>

  <h3>Resumo do dia</h3>
  <table>
    <thead>
      <tr>
        <th>Ônibus</th>
        <th>Confirmados hoje</th>
        <th>Cadastrados</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="linha in sistema.linhas" :key="linha.id">
        <td>{{ linha.nome }} ({{ linha.turno }})</td>
        <td>{{ sistema.totalConfirmados(linha.id) }}</td>
        <td>{{ linha.capacidade - sistema.vagasDisponiveis(linha.id) }}</td>
      </tr>
    </tbody>
  </table>
</template>