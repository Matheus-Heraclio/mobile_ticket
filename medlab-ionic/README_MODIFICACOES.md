# Sistema de Controle de Atendimento - MedLab

## 📋 Sobre o Projeto

Sistema de controle de atendimento para laboratórios médicos desenvolvido em Ionic/Angular, implementando um sistema de filas com priorização inteligente e gerenciamento de senhas.

## ✨ Funcionalidades Implementadas

### Sistema de Senhas
- **Três tipos de senha:**
  - **SP (Prioritária)**: Atendimento prioritário para idosos, gestantes e PCD
  - **SG (Geral)**: Atendimento geral
  - **SE (Exames)**: Retirada de exames

### Lógica de Priorização
- Sequência alternada: `[SP] → [SE|SG] → [SP] → [SE|SG]`
- Qualquer guichê pode atender qualquer tipo de senha
- Priorização automática baseada no tipo e ordem de chegada

### Horário de Funcionamento
- Sistema opera das **7h às 17h**
- Bloqueio automático de emissão fora do horário
- Limpeza automática de senhas às 17h

### Tempo Médio de Atendimento (TM)
- **SP**: 15 minutos (± 5 minutos de variação aleatória)
- **SG**: 5 minutos (± 3 minutos de variação aleatória)
- **SE**: 1 minuto (95% dos casos) ou 5 minutos (5% dos casos)

### Descarte Automático
- 5% das senhas são automaticamente descartadas (simulação de não comparecimento)

### Relatórios e Estatísticas
- Quantitativo geral de senhas emitidas
- Quantitativo geral de senhas atendidas
- Estatísticas por tipo de senha
- Relatório de tempo médio de atendimento
- Relatório detalhado com filtros de período

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm
- Ionic CLI (opcional, para desenvolvimento)

### Passos de Instalação

1. **Instalar dependências:**
```bash
cd medlab-ionic
npm install
# ou
pnpm install
```

2. **Executar em modo de desenvolvimento:**
```bash
npm start
# ou
ionic serve
```

3. **Acessar o sistema:**
- Abra o navegador em `http://localhost:8100`

## 📱 Páginas do Sistema

### 1. Totem (Emissão de Senhas)
- **Rota:** `/totem`
- **Função:** Emitir senhas para os clientes
- **Recursos:**
  - Botões para cada tipo de senha
  - Validação de horário de funcionamento
  - Exibição da senha gerada

### 2. Atendente
- **Rota:** `/atendente`
- **Função:** Gerenciar atendimento nos guichês
- **Recursos:**
  - Seleção de guichê (1 a 5)
  - Chamar próxima senha (com priorização automática)
  - Iniciar/finalizar atendimento
  - Visualização de tempo médio esperado
  - Estatísticas da fila por tipo

### 3. Painel de Chamados
- **Rota:** `/painel`
- **Função:** Exibir as últimas senhas chamadas
- **Recursos:**
  - Exibe as 5 últimas senhas chamadas
  - Atualização em tempo real

### 4. Dashboard
- **Rota:** `/dashboard`
- **Função:** Visualizar estatísticas e relatórios
- **Recursos:**
  - Estatísticas gerais
  - Filtros por período, tipo e status
  - Relatório de tempo médio
  - Limpeza manual de senhas

## 🗄️ Armazenamento de Dados

O sistema utiliza **localStorage** para persistência de dados, sem necessidade de backend ou banco de dados.

### Chaves de Armazenamento
- `sistema_senhas_dados`: Array de senhas serializadas
- `sistema_senhas_contadores`: Contadores diários por tipo

### Estrutura de Dados

```typescript
interface Senha {
  id: string;
  numero: string;              // Formato: YYMMDD-PPSQ
  tipo: TipoSenha;            // SP, SG ou SE
  dataEmissao: Date;
  dataChamada?: Date;
  dataAtendimentoInicio?: Date;
  dataAtendimentoFim?: Date;
  guiche?: number;
  atendida: boolean;
  naoAtendida: boolean;
  tempoAtendimento?: number;  // em minutos
}
```

## 🔧 Serviços

### SenhaService
- `emitirSenha(tipo)`: Emite nova senha com validação de horário
- `obterSenhas()`: Retorna todas as senhas
- `obterUltimasChamadas(5)`: Retorna as 5 últimas chamadas
- `estaNoHorarioDeFuncionamento()`: Verifica horário
- `limparSenhasDoDia()`: Remove senhas do dia

### FilaService
- `chamarProximo(guiche)`: Chama próxima senha com priorização
- `finalizarAtendimento(senha)`: Finaliza atendimento
- `calcularTempoMedioEsperado(tipo)`: Calcula TM esperado
- `obterContagemPorTipo()`: Retorna contagem por tipo

### EstatisticasService
- `obterEstatisticas()`: Estatísticas gerais
- `obterRelatorioTempoMedio()`: Relatório de TM
- `obterRelatorioDetalhado()`: Relatório completo
- `obterRelatorioDiario(data)`: Relatório do dia
- `obterRelatorioMensal(ano, mes)`: Relatório mensal

## 📊 Formato da Senha

Padrão: `YYMMDD-PPSQ`

- **YY**: Ano (2 dígitos)
- **MM**: Mês (2 dígitos)
- **DD**: Dia (2 dígitos)
- **PP**: Tipo da senha (SP, SG, SE)
- **SQ**: Sequência por prioridade (reinício diário)

**Exemplo:** `251126-SP01` (26/11/2025, Senha Prioritária nº 01)

## 🔄 Fluxo de Atendimento

1. **Cliente** acessa o totem e emite uma senha
2. **Sistema** gera senha com numeração sequencial
3. **Senha** entra na fila de espera
4. **Atendente** clica em "Chamar Próximo"
5. **Sistema** seleciona próxima senha seguindo priorização
6. **Senha** é exibida no painel de chamados
7. **Atendente** inicia e finaliza o atendimento
8. **Sistema** registra tempo de atendimento

## ⚙️ Configurações

### Horário de Funcionamento
Para alterar o horário, edite `senha.service.ts`:

```typescript
// Linha ~56
if (hora < 7 || hora >= 17) {
  throw new Error('Fora do horário...');
}
```

### Tempo Médio de Atendimento
Para alterar os tempos, edite `fila.service.ts`:

```typescript
// Método calcularTempoMedioEsperado()
case TipoSenha.SP:
  return 15 + (Math.random() * 10 - 5); // 15 ± 5
```

### Número de Guichês
Para alterar quantidade de guichês, edite `atendente.page.ts`:

```typescript
guiches: number[] = [1, 2, 3, 4, 5]; // Adicione mais números
```

## 🐛 Solução de Problemas

### Senhas não aparecem na fila
- Verifique se está dentro do horário de funcionamento (7h-17h)
- Verifique o console do navegador para erros

### Dados não persistem
- Verifique se o localStorage está habilitado no navegador
- Limpe o cache e tente novamente

### Limpeza automática não funciona
- A limpeza ocorre às 17h00, verifique se o sistema está rodando nesse horário
- Você pode limpar manualmente pelo Dashboard

## 📝 Licença

Este projeto foi desenvolvido como parte de um trabalho acadêmico para a UNINASSAU.

## 👥 Autor

João Ferreira - 2025

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa em `modificacoes_realizadas.md`.
