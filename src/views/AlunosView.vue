<script setup>
import { useSistemaStore } from '../stores/sistema.js'
const sistema = useSistemaStore()

function nomeDoOnibus(id) {
  const linha = sistema.linhas.find((l) => l.id === id)
  return linha ? linha.nome : '-'
}

function excluir(aluno) {
  if (confirm(`Excluir o cadastro de ${aluno.nome}?`)) {
    sistema.excluirAluno(aluno.id)
  }
}
</script>

<template>
  <h2>Alunos cadastrados ({{ sistema.alunos.length }})</h2>

  <p v-if="sistema.alunos.length === 0">Nenhum aluno cadastrado ainda.</p>

  <table v-else>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Curso</th>
        <th>Turno</th>
        <th>Bairro</th>
        <th>Ônibus</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="aluno in sistema.alunos" :key="aluno.id">
        <td>{{ aluno.nome }}</td>
        <td>{{ aluno.curso }}</td>
        <td>{{ aluno.turno }}</td>
        <td>{{ aluno.bairro }}</td>
        <td>{{ nomeDoOnibus(aluno.onibusId) }}</td>
        <td>
          <RouterLink :to="`/alunos/${aluno.id}/editar`" class="btn btn-sec">Editar</RouterLink>
          <button @click="excluir(aluno)" class="btn-perigo" style="margin-left: 8px">
            Excluir
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>