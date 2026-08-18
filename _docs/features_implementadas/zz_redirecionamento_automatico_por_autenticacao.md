# Redirecionamento Automático Conforme Autenticação

## O que o Usuário Consegue Fazer

O usuário nunca precisa se preocupar em "cair" numa tela que não devia ver: se tentar acessar qualquer página do sistema sem estar logado, é automaticamente levado para a tela de login. Se já estiver logado e tentar acessar a tela de login por engano, é automaticamente levado para a página inicial.

## Pontos de Entrada no Sistema

- `middleware.ts`, executado pelo Next.js antes do processamento de qualquer rota coberta pelo `matcher` configurado (todas as rotas, exceto arquivos internos do Next.js, imagens, favicon e ícone).

## Regras de Negócio Observadas

- O middleware consulta o usuário autenticado via `supabase.auth.getUser()`, usando um cliente Supabase criado com `createServerClient` e acesso aos cookies da requisição.
- Se não há usuário autenticado e a rota acessada não é `/login`, o sistema redireciona para `/login`.
- Se há usuário autenticado e a rota acessada é `/login`, o sistema redireciona para `/`.
- Em qualquer outra combinação, a resposta original segue seu curso normal.

## Limitações Observadas

- Não há diferenciação de papéis ou permissões entre usuários autenticados — qualquer pessoa logada tem acesso a todas as páginas da aplicação.
- Não há proteção granular por rota além da checagem binária "logado / não logado".

## Relação com Outras Features

- Depende do resultado de **Acesso à Conta (Login)** e de **Criação de Conta**.
- É o mecanismo que efetiva o encerramento de acesso após **Encerramento de Sessão (Logout)**.

## Pergunta Central Relacionada

Nenhuma conexão direta com as perguntas centrais financeiras listadas em `00_context.md`. É uma capacidade de infraestrutura de acesso, não uma resposta financeira.

## Relação com o Backlog

O item F11 ("Tela de Login e redirecionamentos") está marcado como "✅ Concluída" e menciona explicitamente "Middleware e SSR configurados" como pré-requisito, o que é coerente com a existência e funcionamento do `middleware.ts` observado.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
