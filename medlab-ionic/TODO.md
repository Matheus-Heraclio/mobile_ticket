# Sistema para Controle de Atendimento

Este documento lista as tarefas pendentes, melhorias e próximos passos para o desenvolvimento do sistema de gerenciamento de filas MedLab.

## 1. Backend e Persistência de Dados (Prioridade Alta)

O projeto atualmente utiliza `localStorage` para persistência de dados, o que é inadequado para um sistema multiusuário (Atendente, Painel).

- [ ] **Implementar Backend:** Criar uma API RESTful para gerenciar as senhas, filas e estatísticas.
  - [ ] Sugestão: Utilizar Node.js/Express ou Firebase.
- [ ] **Migrar Persistência:** Substituir todas as chamadas a `localStorage` nos serviços (`senha.service.ts`, `fila.service.ts`, `estatisticas.service.ts`) por chamadas à nova API.
- [ ] **Autenticação e Autorização:** Implementar um sistema de login para a página do Atendente (`/atendente`) e Dashboard (`/dashboard`).
  - [ ] Proteger rotas sensíveis.

## 2. Configuração e Regras de Negócio (Prioridade Média)

Existem valores e regras de negócio que estão **hardcoded** e devem ser configuráveis.

- [ ] **Horário de Funcionamento:** Tornar o horário de funcionamento (atualmente 7h às 17h em `senha.service.ts`) configurável, idealmente via backend.
  - [ ] Remover o comentário `/*mudar hora aqui*/` na linha 112 de `senha.service.ts`.
- [ ] **Lógica de Priorização:** Tornar a regra de priorização da fila (`[SP] -> [SE|SG] -> [SP] -> [SE|SG]` em `fila.service.ts`) configurável.
- [ ] **Taxa de Não Atendimento:** Remover ou tornar configurável a simulação de 5% de não atendimento (`Math.random() < 0.05` em `fila.service.ts`).
- [ ] **Tempos de Atendimento:** Substituir a simulação de tempo de atendimento (`calcularTempoMedioEsperado` em `fila.service.ts`) por dados reais ou um modelo mais robusto.

## 3. Funcionalidades do Sistema de Filas (Prioridade Média)

Melhorias na experiência do usuário e na gestão da fila.

- [ ] **Rechamada de Senha:** Adicionar funcionalidade para o atendente rechamar uma senha que não foi atendida.
- [ ] **Limpeza Automática Confiável:** Revisar a lógica de limpeza automática diária (atualmente às 17h em `senha.service.ts`), que é frágil em aplicações móveis/web. Implementar uma verificação de "última limpeza" ao iniciar o app.
- [ ] **Exportação de Estatísticas:** Adicionar um botão na página de Dashboard para exportar os dados de atendimento (e.g., CSV, Excel) para análise externa.

## 4. Melhorias de Interface e Experiência do Usuário (Prioridade Baixa)

- [ ] **Totem (Emissão de Senha):** Implementar uma mensagem amigável na página do Totem (`/totem`) quando o sistema estiver fora do horário de funcionamento, em vez de lançar um erro.
- [ ] **Estilização do Painel:** Garantir que o Painel de Chamada (`/painel`) seja responsivo e tenha um design atraente para exibição em telas grandes.
- [ ] **Internacionalização (i18n):** Preparar o projeto para suportar múltiplos idiomas, se necessário.
