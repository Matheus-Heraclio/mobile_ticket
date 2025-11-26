# Análise de Requisitos - Sistema de Controle de Atendimento

## Requisitos Extraídos do PDF

### 1. Agentes do Sistema
- **AS (Agente Sistema)**: Emite senhas e responde aos comandos da atendente
- **AA (Agente Atendente)**: Aciona o sistema para chamar o próximo na fila e efetuar atendimento no guichê
- **AC (Agente Cliente)**: Aciona totem para emitir senha e aguarda ser chamado no painel

### 2. Tipos de Senha (Priorização)
- **SP (Senha Prioritária)**: Maior prioridade
- **SG (Senha Geral)**: Prioridade média
- **SE (Senha para Retirada de Exames)**: Menor prioridade, mas atendimento rápido

### 3. Tempo Médio de Atendimento (TM)
- **SP**: 15 minutos (pode variar ±5 minutos aleatoriamente)
- **SG**: 5 minutos (pode variar ±3 minutos)
- **SE**: < 1 minuto (95% dos casos 1 minuto, 5% dos casos 5 minutos)

### 4. Lógica de Priorização
Sequência: `[SP] -> [SE|SG] -> [SP] -> [SE|SG]`
- Sempre atende SP primeiro se houver
- Depois atende SE ou SG (se houver)
- Repete o ciclo até esvaziar todas as filas

### 5. Horário de Funcionamento
- **Início**: 7h da manhã
- **Fim**: 17h (5 PM)
- Senhas fora desse horário devem ser descartadas

### 6. Painel de Chamados
- Exibe as **5 últimas senhas chamadas**
- Não exibe a próxima senha (ela muda entre finalização do SA e acionamento do AA)

### 7. Guichês
- Não há guichês específicos para tipos de senha
- Qualquer guichê pode atender qualquer tipo de senha

### 8. Descarte de Senhas
- 5% das senhas não são atendidas (responsabilidade do AC)
- Devem ser descartadas sem executar o SA

### 9. Formato da Senha
Padrão: `YYMMDD-PPSQ`
- **YY**: Ano (2 dígitos)
- **MM**: Mês (2 dígitos)
- **DD**: Dia (2 dígitos)
- **PP**: Tipo da senha (SP, SG, SE)
- **SQ**: Sequência por prioridade (reinício diário)

### 10. Relatórios
- **Quantitativo geral de senhas emitidas**
- **Quantitativo geral de senhas atendidas**
- **Quantitativo de senhas emitidas por prioridade**
- **Quantitativo de senhas atendidas por prioridade**
- **Relatório detalhado**: numeração, tipo, data/hora emissão, data/hora atendimento, guichê responsável
- **Relatório de TM**: variação aleatória no atendimento

### 11. Infraestrutura Mencionada (NÃO USAR)
- MySQL 8.0
- Backend em NodeJS
- Frontend em React, Angular ou Vue
- **OBSERVAÇÃO**: O usuário pediu para NÃO usar backend nem banco de dados, apenas variáveis de sessão

## Estrutura Atual do Projeto

### Páginas Encontradas
1. `/totem` - Para emissão de senhas (AC)
2. `/painel` - Para exibição de chamados
3. `/atendente` - Para atendimento (AA)
4. `/dashboard` - Para relatórios e estatísticas

### Serviços Encontrados
1. `senha.service.ts` - Gerenciamento de senhas
2. `fila.service.ts` - Gerenciamento de filas
3. `estatisticas.service.ts` - Estatísticas e relatórios

### Componentes Encontrados
1. `botao-grande` - Botões para interface
2. `painel-senha` - Painel de exibição
3. `card-senha` - Card individual de senha
4. `tabela-senhas` - Tabela de senhas

## Próximos Passos
1. Analisar o código atual dos serviços e páginas
2. Comparar com os requisitos do PDF
3. Identificar gaps e funcionalidades faltantes
4. Implementar modificações necessárias
