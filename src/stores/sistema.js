import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db.js'

const limpo = (obj) => JSON.parse(JSON.stringify(obj))
const gravar = (tabela, obj) => db[tabela].put(limpo(obj)).catch(console.error)
const apagar = (tabela, id) => db[tabela].delete(id).catch(console.error)

export const useSistemaStore = defineStore('sistema', () => {
  const linhas = ref([])
  const alunos = ref([])
  const motoristas = ref([])
  const avisos = ref([])

  async function carregarDados() {
    linhas.value = await db.linhas.toArray()
    alunos.value = await db.alunos.toArray()
    motoristas.value = await db.motoristas.toArray()
    avisos.value = (await db.avisos.toArray()).sort((a, b) => b.id - a.id)
  }

  function vagasDisponiveis(onibusId) {
    const linha = linhas.value.find((l) => l.id === onibusId)
    if (!linha) return 0
    const ocupadas = alunos.value.filter((a) => a.onibusId === onibusId).length
    return linha.capacidade - ocupadas
  }

  // ÔNIBUS
  function adicionarOnibus(dados) {
    const novo = { ...dados, id: Date.now() }

    linhas.value.push(novo)
    gravar('linhas', novo)
  }
  function atualizarOnibus(id, dados) {
    const i = linhas.value.findIndex((l) => l.id === id)
    if (i === -1) return
    linhas.value[i] = { ...linhas.value[i], ...dados }
    gravar('linhas', linhas.value[i])
  }

  function excluirOnibus(id) {
    if (alunos.value.some((a) => a.onibusId === id)) return false
    linhas.value = linhas.value.filter((l) => l.id !== id)
    apagar('linhas', id)
    motoristas.value.forEach((m) => {
      if (m.onibusId === id) {
        m.onibusId = null
        gravar('motoristas', m)
      }
    })
    return true
  }

  // ALUNOS
  function adicionarAluno(dados) {
    const novo = { id: Date.now(), usoHoje: null, ...dados }
    alunos.value.push(novo)
    gravar('alunos', novo)
  }
  function atualizarAluno(id, dados) {
    const i = alunos.value.findIndex((a) => a.id === id)
    if (i === -1) return
    alunos.value[i] = { ...alunos.value[i], ...dados }
    gravar('alunos', alunos.value[i])
  }
  function excluirAluno(id) {
    alunos.value = alunos.value.filter((a) => a.id !== id)
    apagar('alunos', id)
  }

  // MOTORISTAS
  function adicionarMotorista(dados) {
    const novo = { id: Date.now(), ...dados }
    motoristas.value.push(novo)
    gravar('motoristas', novo)
  }
  function atualizarMotorista(id, dados) {
    const i = motoristas.value.findIndex((m) => m.id === id)
    if (i === -1) return
    motoristas.value[i] = { ...motoristas.value[i], ...dados }
    gravar('motoristas', motoristas.value[i])
  }
  function excluirMotorista(id) {
    motoristas.value = motoristas.value.filter((m) => m.id !== id)
    apagar('motoristas', id)
  }

  // AVISOS
  function adicionarAviso(texto) {
    const novo = { id: Date.now(), texto, data: new Date().toLocaleDateString('pt-BR') }
    avisos.value.unshift(novo)
    gravar('avisos', novo)
  }
  function excluirAviso(id) {
    avisos.value = avisos.value.filter((a) => a.id !== id)
    apagar('avisos', id)
  }

  // CONFIRMAÇÃO DIÁRIA
  function hoje() {
    return new Date().toLocaleDateString('sv-SE')
  }

  function confirmarUso(id, usa) {
    const i = alunos.value.findIndex((a) => a.id === id)
    if (i === -1) return
    alunos.value[i].usoHoje = { data: hoje(), usa }
    gravar('alunos', alunos.value[i])
  }

 
  function usoDeHoje(aluno) {
    if (aluno.usoHoje && aluno.usoHoje.data === hoje()) return aluno.usoHoje.usa
    return null
  }

  function totalConfirmados(onibusId) {
    return alunos.value.filter((a) => a.onibusId === onibusId && usoDeHoje(a) === true).length
  }

  return {
    linhas, alunos, motoristas, avisos,
    carregarDados,
    vagasDisponiveis,
    adicionarOnibus, atualizarOnibus, excluirOnibus,
    adicionarAluno, atualizarAluno, excluirAluno,
    adicionarMotorista, atualizarMotorista, excluirMotorista,
    adicionarAviso, excluirAviso,
    confirmarUso, usoDeHoje, totalConfirmados,
  }
})
