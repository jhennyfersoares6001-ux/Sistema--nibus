import Dexie from 'dexie'

export const db = new Dexie('onibus_universitario')

db.version(1).stores({
  linhas: 'id',
  alunos: 'id',
  motoristas: 'id',
  avisos: 'id',
})