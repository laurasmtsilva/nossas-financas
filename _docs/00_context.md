# 00_context.md

# Nossas Finanças

> Documento de contexto do projeto.
>
> Este arquivo apresenta a visão geral do sistema e serve como ponto de partida para qualquer pessoa (ou IA) que participe do desenvolvimento.


## 1. Objetivo do Produto
```
**Nossas Finanças** é um aplicativo de controle financeiro familiar cujo objetivo principal é permitir que todos os membros da família tomem decisões financeiras com segurança, utilizando uma visão compartilhada, clara e compreensível da situação financeira.

O foco do aplicativo não é apenas registrar receitas e despesas, mas transformar informações financeiras em decisões simples do dia a dia.

Exemplos das perguntas que o aplicativo deve responder rapidamente:

* Posso fazer esta compra?
* Quanto ainda posso gastar este mês?
* Qual cartão é mais adequado para esta compra?
* Quanto dinheiro realmente temos disponível?
* Estamos dentro do orçamento?
```


## 2. Público-alvo
```
O aplicativo foi inicialmente desenvolvido para uso de um casal neurodivergente, mas sua arquitetura deve permitir expansão para outros núcleos familiares.

Desde o início, o sistema deve considerar:

* múltiplos usuários;
* diferentes níveis de conhecimento financeiro;
* diferentes perfis de acesso;
* compartilhamento seguro de informações.
```
### Perfil dos usuários iniciais

### Usuário A
```
* conhecimento financeiro: alto;
* conhecimento técnico: alto;
* principal responsável pelo desenvolvimento do sistema;
* necessita de rapidez e flexibilidade.
```
### Usuário B
```
* conhecimento financeiro: básico;
* conhecimento técnico: intermediário;
* necessita de linguagem simples, explicações claras e informações fáceis de interpretar.

Esses perfis representam extremos de conhecimento financeiro. As decisões de UX devem funcionar bem para ambos.
```


## 3. Problemas que o produto resolve

O aplicativo existe para reduzir três problemas principais.

### I. Falta de visão consolidada

As informações financeiras normalmente ficam distribuídas entre bancos, cartões, contas e aplicativos diferentes.

O sistema deve consolidar essas informações em uma única visão.

### II. Dificuldade na tomada de decisão

Ter acesso aos números não significa entender a situação financeira.

O aplicativo deve transformar dados em respostas práticas.

### III. Compartilhamento da gestão financeira

Todos os membros da família devem conseguir compreender a situação financeira sem depender do conhecimento ou da presença de outro usuário.


## 4. Filosofia do Produto

Quando houver dúvidas sobre uma decisão de desenvolvimento, os seguintes princípios têm prioridade.

### Simplicidade

O sistema deve ser simples de utilizar.

Sempre que duas soluções resolverem o mesmo problema, deve-se preferir a mais simples.

### Clareza

As informações devem ser compreendidas rapidamente.

Evitar ambiguidade, excesso de informação e interfaces confusas.

### Redução da carga cognitiva

O aplicativo deve reduzir o esforço mental necessário para controlar as finanças.

Nunca deve obrigar o usuário a realizar cálculos mentais para entender sua situação.

### Transparência

Todo valor apresentado pelo sistema deve poder ser explicado.

O usuário deve conseguir entender como cada cálculo foi realizado.

### Consistência

A mesma ação deve produzir sempre o mesmo comportamento.

Terminologia, cores, ícones e navegação devem permanecer consistentes em todo o aplicativo.

### Progressividade

Mostrar primeiro apenas as informações essenciais.

Detalhes devem aparecer somente quando necessários ou solicitados pelo usuário.


## 5. Princípios de UX
```
As seguintes diretrizes orientam toda a experiência do usuário.

* Priorizar reconhecimento em vez de memorização.
* Priorizar leitura rápida.
* Reduzir distrações.
* Utilizar linguagem acessível.
* Evitar jargões financeiros quando possível.
* Quando o uso de um termo técnico for necessário, fornecer explicação clara.
* Destacar visualmente as informações importantes.
* Evitar telas visualmente carregadas.
* Utilizar feedback visual imediato após ações importantes.
* Nunca depender apenas da memória do usuário.
```


## 6. Definição de Qualidade

Neste projeto, qualidade significa:

> Permitir que os usuários tomem decisões financeiras corretas com rapidez e confiança.

Uma funcionalidade é considerada de qualidade quando:
```
* reduz erros;
* reduz dúvidas;
* diminui carga cognitiva;
* apresenta informações corretas;
* possui comportamento previsível;
* mantém consistência visual e funcional;
* possui desempenho adequado.
```


## 7. Escopo Funcional

O sistema oferece funcionalidades como:
```
* cadastro de receitas;
* cadastro de despesas;
* controle de cartões;
* acompanhamento de contas;
* orçamento mensal;
* limites de cartão;
* resumos financeiros;
* indicadores;
* gráficos;
* planejamento financeiro.
```
Essas funcionalidades existem para atender aos objetivos definidos neste documento.

Elas não constituem, por si só, a missão do produto.


## 8. Diretrizes de Desenvolvimento

Ao desenvolver novas funcionalidades:
```
* compreender primeiro o problema do usuário;
* somente depois escolher a solução técnica;
* evitar adicionar complexidade sem benefício claro;
* preservar consistência com funcionalidades existentes;
* documentar decisões arquiteturais relevantes;
* evitar refatorações apenas por preferência pessoal;
* priorizar evolução incremental do sistema.
```


## 9.Stack Tecnológica

### Frontend
```
- Next.js
- React
- TypeScript
```
### Hospedagem
```
- Vercel
```

### Banco de Dados
```
- Supabase
```

#### Autenticação
```
- Supabase
```

#### Principais bibliotecas
```
- Supabase
```


## 10. Fonte de Verdade

Este documento descreve a filosofia do projeto.

Informações específicas encontram-se em documentos próprios:
```
* `01_system_overview.md`
* `02_legacy_assessment.md`
```
Este documento deve permanecer pequeno, estável e atualizado, servindo como referência para todas as decisões do projeto.
