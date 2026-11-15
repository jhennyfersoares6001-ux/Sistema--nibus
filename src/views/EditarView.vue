<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSistemaStore } from '../stores/sistema.js'

const sistema = useSistemaStore()
const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const aluno = sistema.alunos.find((a) => a.id === id)

const form = ref(aluno ? { ...aluno } : null)
const erro = ref('')

const linhasDoTurno = computed(() =>
  sistema.linhas.filter((l) => l.turno === form.value.turno)
)

function salvar() {
  erro.value = ''
  const f = form.value

  if (!f.nome || !f.faculdade || !f.curso || !f.turno || !f.bairro || !f.endereco || !f.onibusId) {
    erro.value = 'Preencha todos os campos.'
    return
  }
  
  if (f.onibusId !== aluno.onibusId && sistema.vagasDisponiveis(f.onibusId) <= 0) {
    erro.value = 'Este ônibus não tem mais vagas.'
    return
  }

  sistema.atualizarAluno(id, { ...f })
  router.push('/alunos')
}
</script>

<template>
  <h2>Editar cadastro</h2>

  <p v-if="!form">Aluno não encontrado.</p>

  <form v-else @submit.prevent="salvar">
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
            <option :value="null">Selecione</option>
                <option v-for="linha in linhasDoTurno" :key="linha.id" :value="linha.id">
                    {{ linha.nome }} ({{ sistema.vagasDisponiveis(linha.id) }} vagas)

    </option>
      </select>
    </label>

    <p v-if="erro" style="color: red">{{ erro }}</p>

    <button type="submit">Salvar alterações</button>
    <RouterLink to="/alunos" class="btn btn-sec" style="margin-left: 12px">Cancelar</RouterLink>
  </form>
</template>