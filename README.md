# Vehicle Tracking — Frontend

Interface web para rastreamento de veículos em tempo real, com listagem e mapa interativo.

## Stack

- **Next.js 16** com App Router
- **React 19** + TypeScript 5
- **Tailwind CSS v4** + shadcn/ui
- **Leaflet + react-leaflet** — mapa interativo
- **SWR v2** — data fetching com revalidação automática (30s)
- **Zustand v5** — estado global do mapa
- **Axios** — requisições HTTP e mutações
- **react-hook-form + Zod** — formulários com validação
- **Sonner** — notificações toast

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env se necessário

# 3. Iniciar em desenvolvimento
npm run dev
```

Ou em modo produção:

```bash
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Variáveis de ambiente

| Variável              | Descrição               | Padrão                  |
| --------------------- | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | URL base da API backend | `http://localhost:8000` |

## Funcionalidades

- **Listagem de veículos** em tabela com placa, velocidade e status de ignição
- **Mapa interativo** (OpenStreetMap) com marcadores para cada veículo
- Clicar em um veículo na tabela **centraliza o mapa** naquela posição (`flyTo`)
- **Criar, editar e deletar** veículos via dialogs
- Atualização automática dos dados a cada 5 segundos

## Estrutura relevante

```
app/(private)/
  layout.tsx                  # Header com tabs de navegação
  veiculos/
    page.tsx                  # Tabela de veículos + dialogs
    _components/
      vehicle-columns.tsx     # Definição de colunas @tanstack/react-table
      add-edit-vehicle-dialog # Dialog de criação/edição
      delete-vehicle-dialog   # Dialog de confirmação de exclusão
  mapa/
    page.tsx                  # Cards de resumo + mapa interativo
components/shared/map/
  vehicle-map.tsx             # MapContainer Leaflet (dynamic import)
  map-initializer.tsx         # Captura instância do mapa para o store
stores/map-store.ts           # Zustand store com referência do mapa
api/
  index.ts                    # apiClient Axios + fetcher SWR
  queries/vehicles.ts         # Hooks SWR + types
```
