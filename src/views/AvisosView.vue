<script setup>
import { ref } from 'vue'
import { useSistemaStore } from '../stores/sistema.js'

const sistema = useSistemaStore()
const texto = ref('')
const erro = ref('')

function publicar() {
  erro.value = ''
  if (!texto.value.trim()) {
    erro.value = 'Escreva o aviso antes de publicar.'
    return
  }
  sistema.adicionarAviso(texto.value.trim())
  texto.value = ''
}

function excluir(aviso) {
  if (confirm('Excluir este aviso?')) {
    sistema.excluirAviso(aviso.id)
  }
}
</script>

<template>
  <h2>Avisos (administração)</h2>

  <form @submit.prevent="publicar">
    <label>Novo aviso
      <textarea
        v-model="texto"
        rows="3"
        placeholder="Ex.: Amanhã o Ônibus 01 sairá 10 minutos mais cedo."
      ></textarea>
    </label>

    <p v-if="erro" style="color: var(--perigo)">{{ erro }}</p>

    <button type="submit">Publicar aviso</button>
  </form>

  <h3>Avisos publicados ({{ sistema.avisos.length }})</h3>

  <p v-if="sistema.avisos.length === 0">Nenhum aviso publicado.</p>

  <div v-for="aviso in sistema.avisos" :key="aviso.id" class="cartao">
    <small>{{ aviso.data }}</small>
    <p>{{ aviso.texto }}</p>
    <button class="btn-perigo" @click="excluir(aviso)">Excluir</button>
  </div>
</template>