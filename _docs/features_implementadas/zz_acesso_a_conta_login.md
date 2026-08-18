# Acesso à Conta (Login)

## O que o Usuário Consegue Fazer

O usuário consegue entrar no sistema informando o e-mail e a senha que já possui cadastrados. Ao entrar com sucesso, é levado diretamente para a página inicial da aplicação.

## Pontos de Entrada no Sistema

- Tela `/login`, no modo padrão (login), que é o estado inicial da página (`modoLogin = true`).

## Regras de Negócio Observadas

- Exige que os campos de e-mail e senha estejam preenchidos (`if (!emailAuth || !senhaAuth) return alert("Preencha todos os campos!")`).
- A autenticação é feita via `supabase.auth.signInWithPassword({ email, password })`.
- Em caso de erro, é exibido um alerta genérico ("Erro ao entrar. Verifique suas credenciais."), sem detalhar a mensagem específica retornada pelo Supabase.
- Em caso de sucesso, o usuário é redirecionado para `/` usando `window.location.href = '/'` (redirecionamento de página inteira, não navegação client-side).

## Limitações Observadas

- Não há opção de "esqueci minha senha" nesta tela.
- Não há login via provedores externos (Google, Apple etc.), embora as bibliotecas `@supabase/auth-ui-react` e `@supabase/auth-ui-shared` estejam listadas em `package.json` — não há evidência de que sejam efetivamente utilizadas nesta página.
- Não há opção "lembrar-me" ou de manter sessão por período estendido configurável pelo usuário.

## Relação com Outras Features

- Depende da existência de uma conta previamente criada (ver **Criação de Conta**).
- Após o login, o comportamento de navegação subsequente é regido pelo **Redirecionamento Automático por Autenticação** (middleware).
- Conecta-se com **Encerramento de Sessão (Logout)**, disponível na barra de navegação após o login.

## Pergunta Central Relacionada

Nenhuma conexão direta com as perguntas centrais financeiras listadas em `00_context.md`.

## Relação com o Backlog

O item F11 ("Tela de Login e redirecionamentos") está marcado como "✅ Concluída". Isso é coerente com o observado: login funcional com tratamento de erro e redirecionamento após sucesso.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
