# Guia de Testes - Sistema de Controle de Atendimento

## 🎯 Objetivo

Este guia fornece instruções passo a passo para testar todas as funcionalidades do sistema e verificar se os requisitos do PDF foram atendidos.

## 🚀 Preparação

### 1. Iniciar o Sistema

```bash
cd medlab-ionic
npm install
npm start
```

Aguarde o sistema iniciar em `http://localhost:8100`

### 2. Limpar Dados Anteriores (Opcional)

Abra o console do navegador (F12) e execute:
```javascript
localStorage.clear();
location.reload();
```

## ✅ Testes Funcionais

### Teste 1: Validação de Horário de Funcionamento

**Objetivo:** Verificar se o sistema bloqueia emissão de senhas fora do horário 7h-17h

**Passos:**
1. Acesse `/totem`
2. Se estiver fora do horário (antes das 7h ou depois das 17h):
   - ✅ Deve aparecer alerta "Fora do horário de funcionamento"
   - ✅ Botões devem estar desabilitados
3. Se estiver dentro do horário:
   - ✅ Botões devem estar habilitados
   - ✅ Não deve aparecer alerta de horário

**Para testar fora do horário:**
- Altere temporariamente o horário do sistema operacional
- Ou modifique o código em `senha.service.ts` linha 56

**Resultado Esperado:** Sistema bloqueia emissão fora do horário ✅

---

### Teste 2: Emissão de Senhas

**Objetivo:** Verificar se as senhas são geradas corretamente no formato YYMMDD-PPSQ

**Passos:**
1. Acesse `/totem`
2. Clique em "Atendimento Prioritário" (SP)
   - ✅ Deve gerar senha no formato: `251126-SP01`
3. Clique em "Atendimento Geral" (SG)
   - ✅ Deve gerar senha no formato: `251126-SG01`
4. Clique em "Retirada de Exames" (SE)
   - ✅ Deve gerar senha no formato: `251126-SE01`
5. Clique novamente em SP
   - ✅ Deve gerar: `251126-SP02` (sequência incrementada)

**Resultado Esperado:** 
- Formato correto: YYMMDD-PPSQ ✅
- Sequência incrementa por tipo ✅
- Data atual no número ✅

---

### Teste 3: Lógica de Priorização da Fila

**Objetivo:** Verificar se a sequência [SP] → [SE|SG] → [SP] → [SE|SG] é respeitada

**Preparação:**
1. Acesse `/totem` e emita senhas na seguinte ordem:
   - 2x SP (251126-SP01, 251126-SP02)
   - 2x SG (251126-SG01, 251126-SG02)
   - 2x SE (251126-SE01, 251126-SE02)

**Passos:**
1. Acesse `/atendente`
2. Selecione "Guichê 1"
3. Clique em "Chamar Próximo"
   - ✅ Deve chamar: `251126-SP01` (primeira SP)
4. Finalize o atendimento
5. Clique em "Chamar Próximo" novamente
   - ✅ Deve chamar: `251126-SE01` ou `251126-SG01` (SE tem prioridade sobre SG)
6. Finalize o atendimento
7. Clique em "Chamar Próximo"
   - ✅ Deve chamar: `251126-SP02` (segunda SP)
8. Finalize o atendimento
9. Clique em "Chamar Próximo"
   - ✅ Deve chamar: `251126-SE02` ou `251126-SG01` (próxima SE/SG)

**Resultado Esperado:** Sequência alternada respeitada ✅

---

### Teste 4: Guichês Genéricos

**Objetivo:** Verificar se qualquer guichê pode atender qualquer tipo de senha

**Passos:**
1. Emita 1 senha de cada tipo (SP, SG, SE)
2. Acesse `/atendente`
3. Selecione "Guichê 1" e chame próximo
   - ✅ Deve chamar uma senha (provavelmente SP)
4. Mude para "Guichê 2" e chame próximo
   - ✅ Deve chamar outra senha (não importa o tipo)
5. Mude para "Guichê 3" e chame próximo
   - ✅ Deve chamar a última senha

**Resultado Esperado:** 
- Todos os guichês atendem todos os tipos ✅
- Não há vínculo guichê-tipo ✅

---

### Teste 5: Descarte de 5% das Senhas

**Objetivo:** Verificar se aproximadamente 5% das senhas são descartadas automaticamente

**Passos:**
1. Emita 20 senhas de qualquer tipo
2. Acesse `/atendente`
3. Chame e finalize todas as 20 senhas
4. Acesse `/dashboard`
5. Verifique as estatísticas:
   - ✅ Total emitidas: 20
   - ✅ Total atendidas: ~19 (95%)
   - ✅ Total não atendidas: ~1 (5%)

**Nota:** Como é aleatório, pode variar. Em 20 senhas, espera-se 0-2 descartadas.

**Resultado Esperado:** Aproximadamente 5% descartadas ✅

---

### Teste 6: Painel de Últimas Chamadas

**Objetivo:** Verificar se o painel exibe as 5 últimas senhas chamadas

**Passos:**
1. Emita 10 senhas
2. Acesse `/atendente` e chame 7 senhas
3. Acesse `/painel`
4. Verifique:
   - ✅ Deve exibir apenas as 5 últimas chamadas
   - ✅ Ordem decrescente (mais recente primeiro)
   - ✅ Mostra número da senha e guichê

**Resultado Esperado:** Painel mostra 5 últimas chamadas ✅

---

### Teste 7: Tempo Médio de Atendimento

**Objetivo:** Verificar se o TM é calculado e varia conforme especificado

**Passos:**
1. Acesse `/atendente`
2. Chame uma senha SP
   - ✅ Deve mostrar "Tempo médio esperado: 10-20 min" (15 ± 5)
3. Chame uma senha SG
   - ✅ Deve mostrar "Tempo médio esperado: 2-8 min" (5 ± 3)
4. Chame uma senha SE
   - ✅ Deve mostrar "Tempo médio esperado: 1 min" (95% dos casos)

**Resultado Esperado:** TM varia conforme o tipo ✅

---

### Teste 8: Relatórios e Estatísticas

**Objetivo:** Verificar se os relatórios são gerados corretamente

**Passos:**
1. Emita e atenda várias senhas de diferentes tipos
2. Acesse `/dashboard`
3. Verifique:
   - ✅ "Total de senhas emitidas" está correto
   - ✅ "Total de senhas atendidas" está correto
   - ✅ Estatísticas por tipo (SP, SG, SE) estão corretas
4. Teste os filtros:
   - ✅ Filtro "Hoje" mostra apenas senhas de hoje
   - ✅ Filtro por tipo funciona
   - ✅ Filtro por status funciona

**Resultado Esperado:** Relatórios precisos e filtros funcionando ✅

---

### Teste 9: Limpeza Automática de Senhas

**Objetivo:** Verificar se as senhas são limpas às 17h

**Opção 1 - Teste Manual:**
1. Acesse `/dashboard`
2. Clique em "Limpar Senhas do Dia"
3. Confirme
   - ✅ Todas as senhas do dia devem ser removidas

**Opção 2 - Teste Automático:**
1. Emita senhas durante o dia
2. Aguarde até 17h00
   - ✅ Sistema deve limpar automaticamente

**Resultado Esperado:** Limpeza funciona ✅

---

### Teste 10: Persistência de Dados

**Objetivo:** Verificar se os dados persistem após recarregar a página

**Passos:**
1. Emita 5 senhas
2. Recarregue a página (F5)
3. Acesse `/dashboard`
   - ✅ As 5 senhas devem ainda estar lá
4. Feche o navegador completamente
5. Abra novamente e acesse o sistema
   - ✅ As senhas devem persistir

**Resultado Esperado:** Dados persistem no localStorage ✅

---

## 🔍 Testes de Interface

### Teste UI-1: Responsividade

**Passos:**
1. Redimensione a janela do navegador
2. Teste em diferentes tamanhos:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
   - ✅ Interface deve se adaptar

**Resultado Esperado:** Layout responsivo ✅

---

### Teste UI-2: Feedback Visual

**Passos:**
1. No totem, emita uma senha
   - ✅ Deve aparecer card com a senha por 10 segundos
2. No atendente, chame uma senha
   - ✅ Deve aparecer card com informações da senha
3. Tente emitir senha fora do horário
   - ✅ Deve aparecer mensagem de erro

**Resultado Esperado:** Feedback visual claro ✅

---

## 📊 Checklist de Requisitos do PDF

| Requisito | Status | Teste |
|-----------|--------|-------|
| Três tipos de senha (SP, SG, SE) | ✅ | Teste 2 |
| Formato YYMMDD-PPSQ | ✅ | Teste 2 |
| Sequência [SP] → [SE\|SG] → [SP] → [SE\|SG] | ✅ | Teste 3 |
| Qualquer guichê atende qualquer senha | ✅ | Teste 4 |
| Horário 7h-17h | ✅ | Teste 1 |
| Descarte de 5% | ✅ | Teste 5 |
| Painel com 5 últimas chamadas | ✅ | Teste 6 |
| TM variável por tipo | ✅ | Teste 7 |
| Relatórios e estatísticas | ✅ | Teste 8 |
| Limpeza automática às 17h | ✅ | Teste 9 |
| Armazenamento em sessão | ✅ | Teste 10 |

## 🐛 Problemas Conhecidos

### Limpeza Automática
- A limpeza automática verifica a cada minuto se é 17h00
- Se o sistema não estiver rodando às 17h, a limpeza não ocorre
- Solução: Usar limpeza manual no Dashboard

### Descarte Aleatório
- Como é aleatório (5%), pode não ocorrer em amostras pequenas
- Teste com pelo menos 20 senhas para ver o efeito

## 📝 Relatório de Testes

Após executar todos os testes, preencha:

- Data do teste: ___________
- Versão do sistema: 1.0
- Navegador: ___________
- Testes executados: ___/10
- Testes bem-sucedidos: ___/10
- Problemas encontrados: ___________

## ✅ Conclusão

Se todos os testes passaram, o sistema está funcionando conforme os requisitos do PDF e pronto para uso!
