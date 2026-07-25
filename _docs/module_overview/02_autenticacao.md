# Autenticação

## Objetivo

A responsabilidade arquitetural de autenticação é controlar o acesso dos usuários ao sistema, verificando a existência de uma sessão autenticada e direcionando usuários conforme seu estado de autenticação.

O módulo utiliza o serviço de autenticação do Supabase para realizar identificação de usuários e consulta da sessão atual.

---

## O que Existe

### Middleware de autenticação

Arquivo principal:

```
/middleware.ts
```

O middleware do Next.js executa a verificação de autenticação antes do processamento das rotas.

Ele utiliza:

* `@supabase/ssr`;
* `NextResponse`;
* `NextRequest`.

O middleware cria um cliente Supabase utilizando as variáveis:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

e configura o acesso aos cookies da requisição.

---

### Cliente Supabase no frontend

Arquivo:

```
src/lib/supabase.ts
```

Existe um cliente Supabase para uso no navegador.

O cliente é criado utilizando:

```
createBrowserClient
```

da biblioteca:

```
@supabase/ssr
```

e utiliza as mesmas variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

### Página de login

Arquivo:

```
src/app/login/page.tsx
```

A página de autenticação possui dois modos:

* login;
* registro.

Ela mantém estados locais para:

* email;
* senha;
* modo atual da tela.

---

## Como Funciona

### Verificação de sessão pelo middleware

O fluxo inicia com a criação de uma resposta padrão:

```
NextResponse.next()
```

mantendo os headers da requisição original.

Em seguida, o middleware cria um cliente Supabase configurado para ler e atualizar cookies da requisição/resposta.

Depois, consulta o usuário autenticado através de:

```
supabase.auth.getUser()
```

---

### Controle de acesso às rotas

O middleware identifica se a rota atual é a página de login:

```
/login
```

Existem dois comportamentos observados:

1. Usuário não autenticado acessando uma rota diferente de `/login`

O sistema redireciona para:

```
/login
```

2. Usuário autenticado acessando `/login`

O sistema redireciona para:

```
/
```

Caso nenhuma dessas condições ocorra, o middleware retorna a resposta original.

---

### Configuração das rotas monitoradas

O middleware possui configuração de execução através do campo:

```
matcher
```

Ele aplica a verificação às rotas da aplicação, excluindo recursos estáticos como:

* arquivos internos do Next.js;
* imagens;
* favicon;
* arquivos de imagem com extensões específicas.

---

### Fluxo de login

A página de login utiliza o cliente Supabase importado de:

```
@/lib/supabase
```

No envio do formulário de login, o sistema executa:

```
supabase.auth.signInWithPassword()
```

utilizando email e senha informados pelo usuário.

Quando não ocorre erro, o usuário é direcionado para:

```
/
```

---

### Fluxo de registro

Quando o usuário está no modo de registro, o sistema executa:

```
supabase.auth.signUp()
```

utilizando email e senha informados.

Após o registro bem-sucedido, o sistema apresenta uma mensagem de sucesso e retorna o estado da página para modo login.

---

## Relação com o Restante do Sistema

A autenticação se relaciona com o restante do sistema através de dois pontos principais:

### Middleware de aplicação

O middleware funciona como ponto de controle anterior ao acesso das páginas da aplicação.

Ele determina se o usuário pode permanecer na rota solicitada ou deve ser redirecionado para outra rota com base no estado autenticado retornado pelo Supabase.

---

### Supabase

O módulo depende do Supabase para:

* criar clientes de acesso;
* consultar usuário autenticado;
* realizar login;
* realizar registro.

O middleware utiliza `createServerClient`, enquanto o frontend utiliza `createBrowserClient`.

---

### Páginas da aplicação

A página `/login` é o ponto de entrada observado para usuários não autenticados.

O middleware direciona usuários não autenticados para essa página e usuários autenticados que tentam acessar essa página para a rota inicial `/`.

---

## Questões em Aberto

Não foram identificadas questões em aberto relacionadas ao funcionamento observado do módulo de autenticação com base nos arquivos analisados.

Não foram observados, durante esta investigação:

* outros mecanismos de autenticação;
* outros provedores de identidade;
* regras adicionais de autorização;
* gerenciamento de perfis ou permissões.
