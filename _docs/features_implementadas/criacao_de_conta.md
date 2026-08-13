# Criação de Conta

## O que o Usuário Consegue Fazer

O usuário consegue criar uma conta de acesso ao sistema informando apenas e-mail e senha. Depois de criada a conta com sucesso, o sistema mostra uma mensagem de confirmação e leva o usuário de volta à tela de login, para que ele entre com as credenciais recém-criadas.

## Pontos de Entrada no Sistema

- Tela `/login`, alternando para o modo "Registro" através do botão "Registre-se" (estado local `modoLogin`).
- Formulário é o mesmo da tela de login, com o mesmo campo de e-mail e senha, apenas trocando o comportamento do botão de envio.

## Regras de Negócio Observadas

- Exige que os campos de e-mail e senha estejam preenchidos antes de enviar (`if (!emailAuth || !senhaAuth) return alert(...)`).
- A criação da conta é feita via `supabase.auth.signUp({ email, password })`.
- Se ocorrer erro, é exibido um alerta com a mensagem retornada pelo Supabase (`"Erro ao registrar: " + error.message`).
- Se a criação for bem-sucedida, é exibido o alerta "Sucesso! A conta foi criada." e o formulário volta para o modo login (`setModoLogin(true)`) — ou seja, **não** loga o usuário automaticamente.
- No arquivo `supabase/config.toml`, a confirmação de e-mail está desabilitada (`auth.email.enable_confirmations = false`), o que indica que, neste ambiente, contas podem ser criadas sem etapa de confirmação por e-mail.

## Limitações Observadas

- Não há campo para nome, telefone ou qualquer outro dado de perfil além de e-mail e senha.
- Não há seleção de "família" ou vínculo com outros usuários no momento do cadastro, apesar de o produto ser descrito como multiusuário familiar em `00_context.md`.
- Não existe tela ou fluxo de recuperação de senha observável no código.
- Não há validação de força de senha na interface (apenas o que o Supabase Auth aplicar no backend, não observável neste arquivo).

## Relação com Outras Features

- Após a criação bem-sucedida, o usuário é conduzido ao fluxo de **Acesso à Conta (Login)** para efetivamente entrar no sistema.
- Depende da mesma tela e do mesmo cliente Supabase (`src/lib/supabase.ts`) usados pelo Login.

## Pergunta Central Relacionada

Nenhuma conexão direta com as perguntas centrais listadas em `00_context.md` (posso fazer esta compra, quanto posso gastar, etc.). Trata-se de um pré-requisito de acesso ao sistema, não de uma resposta financeira.

## Relação com o Backlog

O item F11 ("Tela de Login e redirecionamentos") está marcado como "✅ Concluída" em `03_backlog.md`. Isso é coerente com o observado: a tela de login com alternância para registro está implementada e funcional.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada — o fluxo de criação de conta está inteiramente contido em `src/app/login/page.tsx` e no cliente `src/lib/supabase.ts`, ambos disponíveis.
