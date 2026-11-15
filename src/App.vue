<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="marca">
      <div class="logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6 2 7" />
          <path d="M10 6h4" />
          <path d="m22 7-2-1" />
          <rect width="16" height="16" x="4" y="3" rx="2" />
          <path d="M4 11h16" />
          <path d="M8 15h.01" />
          <path d="M16 15h.01" />
          <path d="M6 19v2" />
          <path d="M18 21v-2" />
        </svg>
      </div>
      <div>
        <h1>Ônibus <span>Universitário</span></h1>
        <p>Cadastro e controle de vagas</p>
      </div>
    </div>

    <nav>
      <RouterLink to="/">Início</RouterLink>
      <RouterLink to="/onibus">Ônibus</RouterLink>
      <RouterLink to="/cadastro">Cadastrar</RouterLink>
      <RouterLink to="/alunos">Alunos</RouterLink>
      <RouterLink to="/confirmar">Confirmar uso</RouterLink>
      <RouterLink to="/motoristas">Motoristas</RouterLink>
      <RouterLink to="/avisos">Avisos</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>