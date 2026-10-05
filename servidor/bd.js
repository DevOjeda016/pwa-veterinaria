import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const carpeta = path.dirname(fileURLToPath(import.meta.url))

export const bd = new DatabaseSync(path.join(carpeta, 'veterinaria.db'))

bd.exec(readFileSync(path.join(carpeta, 'esquema.sql'), 'utf8'))
