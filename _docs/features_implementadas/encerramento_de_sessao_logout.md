# Encerramento de Sessão (Sair)

## O que o Usuário Consegue Fazer

Em qualquer página do sistema, o usuário consegue encerrar sua sessão clicando no botão "Sair", disponível tanto no menu de navegação de computador quanto no menu de celular.

## Pontos de Entrada no Sistema

- `src/components/Navbar.tsx`, botão "Sair" no menu desktop e no menu mobile retrátil.

## Regras de Negócio Observadas

- A ação chama `supabase.auth.signOut()` e, em seguida, `router.push('/login')`.
- No menu mobile, o clique também fecha o menu retrátil (`setIsOpen(false)`) antes de efetuar o logout.

## Limitações Observadas

- Não há pedido de confirmação antes de encerrar a sessão (a ação é imediata ao clicar).

## Relação com Outras Features

- Depende de uma sessão previamente aberta via **Acesso à Conta (Login)**.
- Após o logout, o **Redirecionamento Automático por Autenticação** garante que o usuário não consiga acessar páginas internas sem logar novamente.

## Pergunta Central Relacionada

Nenhuma conexão direta com as perguntas centrais financeiras listadas em `00_context.md`.

## Relação com o Backlog

Não há item específico em `03_backlog.md` que trate isoladamente do logout; ele aparece implicitamente como parte do escopo de F11 ("Tela de Login e redirecionamentos").

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
