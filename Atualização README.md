# Mobile ticket: Sistema para controle de Atendimento

O Mobile ticket é um sistema de controle de atendimento para laboratórios médicos, desenvolvido com Ionic e Angular. A aplicação implementa um sistema de filas com priorização inteligente, diferentes tipos de atendimento e um painel de visualização em tempo real, otimizando o fluxo de pacientes e a eficiência operacional.

## Visão Geral do Projeto

Este projeto foi concebido para modernizar e agilizar o atendimento em ambientes de saúde, como laboratórios de análises clínicas. Ele substitui os sistemas de senhas tradicionais por uma solução digital, interativa e inteligente, composta por quatro interfaces principais:

•
Totem de Autoatendimento: Permite que os pacientes emitam senhas para diferentes tipos de serviço.

•
Painel de Chamadas: Exibe em tempo real as senhas chamadas e os guichês correspondentes.

•
Interface do Atendente: Oferece aos funcionários as ferramentas para chamar o próximo paciente, finalizar atendimentos e gerenciar a fila.

•
Dashboard de Estatísticas: Apresenta dados e métricas sobre os atendimentos realizados, auxiliando na gestão e na tomada de decisões.

## Módulos Principais

O sistema é dividido em quatro páginas (módulos) principais, cada uma com uma função específica no fluxo de atendimento:

Módulo    Rota    Descrição
Totem   /totem Interface de autoatendimento para a emissão de senhas. Os pacientes podem escolher entre Serviço Prioritário (SP), Serviço Geral (SG) e Exames (SE).
Painel
/painel
Tela pública que exibe as últimas senhas chamadas, o guichê de destino e uma lista das chamadas recentes.
Atendente
/atendente
Área restrita para os colaboradores, onde é possível chamar o próximo paciente da fila, visualizar o tempo de espera e finalizar o atendimento.
Dashboard
/dashboard
Painel administrativo que exibe estatísticas detalhadas sobre o fluxo de atendimento, como total de senhas emitidas, atendidas e não atendidas, além de métricas por tipo de serviço.

## Lógica de Negócio e Priorização

O núcleo do sistema reside em sua lógica de gerenciamento de filas e priorização, implementada nos serviços do Angular.

### Tipos de Senha

Existem três categorias de senhas, cada uma associada a um tipo de serviço:

•
SP (Serviço Prioritário): Atendimento preferencial, destinado a idosos, gestantes e pessoas com necessidades especiais.

•
SG (Serviço Geral): Atendimento convencional.

•
SE (Serviços Especiais): Destinado a procedimentos específicos, como exames.

### Algoritmo de Priorização

A fila é gerenciada por um algoritmo de priorização alternada para garantir um atendimento justo e eficiente. A lógica de chamada segue a regra:

1. Alternância: O sistema alterna a chamada entre uma senha SP e uma senha SE/SG.

2. Prioridade Interna: Dentro do bloco de não prioritários, as senhas SE têm preferência sobre as SG.

3. Exceção: Se não houver senhas do tipo que deveria ser chamado, o sistema chama o próximo tipo disponível, sempre respeitando a ordem de chegada dentro de cada categoria.

Este mecanismo assegura que os atendimentos prioritários sejam realizados rapidamente, sem, no entanto, bloquear completamente o fluxo dos demais serviços.

### Gerenciamento de Dados

Os dados da aplicação, como senhas emitidas e contadores diários, são persistidos no localStorage do navegador. Isso garante que o estado do sistema seja mantido mesmo que a página seja recarregada. Os dados são automaticamente limpos todos os dias às 17h, preparando o sistema para o próximo dia de operação.

## Arquitetura e Tecnologias

O projeto é construído sobre a plataforma Ionic com o framework Angular, utilizando TypeScript como linguagem principal. O Capacitor é empregado para compilar a aplicação para plataformas móveis (iOS e Android) e web.

•
Ionic 8: Framework para desenvolvimento de aplicações multiplataforma.

•
Angular 20: Framework para a construção da interface e da lógica da aplicação.

•
TypeScript: Superset do JavaScript que adiciona tipagem estática.

•
Capacitor 7: Ferramenta para a criação de aplicações nativas a partir de um código-base web.

•
RxJS: Biblioteca para programação reativa, utilizada para gerenciar o estado da aplicação de forma eficiente.

•
SCSS: Pré-processador CSS para a estilização dos componentes.

## Como Executar o Projeto

Para executar o projeto em seu ambiente de desenvolvimento, siga os passos abaixo:

1. Clone o repositório:

git clone https://github.com/seu-usuario/medlab-ionic.git
cd medlab-ionic

2. Instale as dependências:

npm install

3. Inicie o servidor de desenvolvimento:

npm start
   *ou*
ionic serve

A aplicação estará disponível em http://localhost:8100.

## Scripts Disponíveis

O projeto inclui os seguintes scripts, definidos no arquivo package.json:

•
npm start: Inicia o servidor de desenvolvimento do Angular.

•
npm run build: Compila a aplicação para produção.

•
npm test: Executa os testes unitários com Karma e Jasmine.

•
npm run lint: Analisa o código-fonte em busca de erros e inconsistências de estilo.

## Estrutura de Diretórios

medlab-ionic/

├── src/

│   ├── app/

│   │   ├── components/    # Componentes reutilizáveis

│   │   ├── models/        # Modelos de dados (interfaces TypeScript )

│   │   ├── pages/         # Páginas da aplicação (módulos)

│   │   │   ├── atendente/

│   │   │   ├── dashboard/

│   │   │   ├── painel/

│   │   │   └── totem/

│   │   ├── services/      # Serviços com a lógica de negócio

│   │   │   ├── estatisticas.service.ts

│   │   │   ├── fila.service.ts

│   │   │   └── senha.service.ts

│   │   ├── app-routing.module.ts

│   │   └── app.module.ts

│   ├── assets/          # Ícones, imagens e outros recursos

│   └── theme/           # Variáveis de estilo globais

├── angular.json       # Configurações do Angular CLI

├── capacitor.config.ts  # Configurações do Capacitor

├── ionic.config.json    # Configurações do Ionic

└── package.json         # Dependências e scripts do projeto

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.



