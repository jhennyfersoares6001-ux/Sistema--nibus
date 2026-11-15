<script setup>
import { computed } from 'vue'
import { useSistemaStore } from '../stores/sistema.js'

const sistema = useSistemaStore()

function motoristasDaLinha(id) {
  return sistema.motoristas.filter((m) => m.onibusId === id)
}

function ocupacao(linha) {
  const ocupadas = linha.capacidade - sistema.vagasDisponiveis(linha.id)
  return Math.round((ocupadas / linha.capacidade) * 100)
}

const vagasLivres = computed(() =>
  sistema.linhas.reduce((soma, l) => soma + sistema.vagasDisponiveis(l.id), 0)
)
</script>

<template>
  <section class="hero">
    <h2>Bem-vindo ao Sistema de Transporte</h2>
    <p>Cadastre-se, escolha seu ônibus e confirme seu uso do dia.</p>
  </section>

  <div class="stats">
    <div class="stat"><strong>{{ sistema.linhas.length }}</strong><span>Ônibus</span></div>
    <div class="stat"><strong>{{ sistema.alunos.length }}</strong><span>Alunos cadastrados</span></div>
    <div class="stat"><strong>{{ vagasLivres }}</strong><span>Vagas livres</span></div>
    <div class="stat"><strong>{{ sistema.motoristas.length }}</strong><span>Motoristas</span></div>
  </div>

  <div v-if="sistema.avisos.length > 0" class="aviso-box">
    <h3>📢 Avisos</h3>
    <p v-for="aviso in sistema.avisos" :key="aviso.id">
      <small>{{ aviso.data }}</small><br />
      {{ aviso.texto }}
    </p>
  </div>

  <div class="grid">
    <RouterLink to="/onibus" class="acao">
      <h4>Cadastrar ônibus</h4>
      <p>Defina turno, horário, vagas e ponto de embarque.</p>
      <span class="btn">Cadastrar</span>
    </RouterLink>
    <RouterLink to="/cadastro" class="acao">
      <h4>Cadastrar aluno</h4>
      <p>Escolha seu turno e ônibus.</p>
      <span class="btn">Cadastrar</span>
    </RouterLink>
    <RouterLink to="/confirmar" class="acao">
      <h4>Confirmar uso</h4>
      <p>Avise se vai de ônibus hoje.</p>
      <span class="btn btn-sec">Confirmar</span>
    </RouterLink>
  </div>

  <h3>Linhas disponíveis</h3>

  <div v-if="sistema.linhas.length === 0" class="cartao">
    <p>Nenhum ônibus cadastrado ainda.</p>
    <RouterLink to="/onibus" class="btn">Cadastrar o primeiro ônibus</RouterLink>
  </div>

  <div v-for="linha in sistema.linhas" :key="linha.id" class="cartao">
    <h3>{{ linha.nome }} · {{ linha.turno }}</h3>
    <p v-if="linha.rota"><strong>Rota:</strong> {{ linha.rota }}</p>
    <p><strong>Ponto de embarque:</strong> {{ linha.pontoEmbarque }}</p>
    <p><strong>Horário:</strong> {{ linha.horario }}</p>
    <p v-if="linha.bairros && linha.bairros.length">
      <strong>Bairros atendidos:</strong> {{ linha.bairros.join(', ') }}
    </p>
    <p>
      <strong>Motorista:</strong>
      {{ motoristasDaLinha(linha.id).map((m) => m.nome).join(', ') || 'não definido' }}
    </p>
    <p>
      <strong>Vagas:</strong>
      {{ sistema.vagasDisponiveis(linha.id) }} de {{ linha.capacidade }}
      <span v-if="sistema.vagasDisponiveis(linha.id) === 0" style="color: var(--perigo)">
        (lotado)
      </span>
    </p>
    <div class="barra">
      <div class="barra-fill" :style="{ width: ocupacao(linha) + '%' }"></div>
    </div>
  </div>
</template>