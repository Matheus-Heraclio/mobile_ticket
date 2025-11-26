# Sistema de Senhas - Versão Ionic

Este projeto é a conversão do sistema de gerenciamento de senhas original (Angular standalone) para Ionic Framework.

## Estrutura do Projeto

O projeto mantém todas as funcionalidades originais:

### Páginas
- **Totem**: Emissão de senhas (SP, SG, SE)
- **Painel**: Visualização das últimas senhas chamadas
- **Atendente**: Gerenciamento de atendimento por guichê
- **Dashboard**: Estatísticas e relatórios detalhados

### Serviços
- `SenhaService`: Gerenciamento de senhas e persistência no localStorage
- `FilaService`: Controle da fila de atendimento
- `EstatisticasService`: Cálculo de estatísticas

### Componentes
- `BotaoGrandeComponent`: Botões grandes coloridos
- `PainelSenhaComponent`: Cards de senha para o painel
- `CardSenhaComponent`: Cards de senha para listagem
- `TabelaSenhasComponent`: Tabela de senhas do dashboard

## Problema Identificado

Durante a conversão, foi identificado um conflito entre componentes standalone (usados nos componentes reutilizáveis) e módulos NgModule (usados nas páginas geradas pelo Ionic CLI).

## Solução Recomendada

Para resolver o problema de compilação, você tem duas opções:

### Opção 1: Converter tudo para Módulos (Recomendado para Ionic)

Remover `standalone: true` dos componentes e importá-los nos módulos das páginas.

### Opção 2: Converter tudo para Standalone (Moderno)

Remover os módulos das páginas e converter tudo para componentes standalone.

## Instalação e Execução

```bash
cd medlab-ionic
npm install
ionic serve
```

## Build para Produção

```bash
npm run build
```

## Estrutura de Arquivos

```
src/app/
├── models/           # Modelos de dados (Senha, TipoSenha, Estatisticas)
├── services/         # Serviços (SenhaService, FilaService, EstatisticasService)
├── components/       # Componentes reutilizáveis
│   ├── botao-grande/
│   ├── card-senha/
│   ├── painel-senha/
│   └── tabela-senhas/
└── pages/           # Páginas da aplicação
    ├── totem/
    ├── painel/
    ├── atendente/
    └── dashboard/
```

## Funcionalidades Mantidas

✅ Emissão de senhas por tipo (SP, SG, SE)
✅ Numeração automática diária
✅ Painel de chamadas em tempo real
✅ Gestão de atendimento por guichê
✅ Estatísticas completas
✅ Filtros de relatório
✅ Persistência de dados no localStorage
✅ Interface responsiva

## Diferenças do Original

- Menu lateral Ionic substituindo a barra de navegação superior
- Componentes Ionic (ion-button, ion-card, ion-select, etc.)
- Navegação com ion-router-outlet
- Estilos adaptados para Ionic (CSS Variables)
- Suporte nativo para mobile (Capacitor)

## Próximos Passos

1. Resolver o conflito standalone/module
2. Testar todas as funcionalidades
3. Ajustar estilos se necessário
4. Adicionar suporte para plataformas mobile (iOS/Android)

## Tecnologias

- Ionic 8
- Angular 17
- TypeScript
- RxJS
- Capacitor (para mobile)
