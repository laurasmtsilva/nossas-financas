# Estrutura do Repositório

Este documento descreve a organização física do repositório e a responsabilidade de cada diretório.

> **Fonte de verdade**
>
> Esta estrutura representa a organização atual do projeto. Sempre que diretórios forem criados, removidos ou tiverem sua responsabilidade alterada, este documento deve ser atualizado.

---

# Visão Geral

```text
/
├── _docs/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── cartoes/page.tsx
│   │   ├── categorias/page.tsx
│   │   ├── contas/page.tsx
│   │   ├── faturas/page.tsx
│   │   ├── lacamentos/page.tsx
│   │   ├── login/page.tsx
│   │   ├── teste-parser/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   ├── components/
│   │   ├── IconeCategoria.tsx
│   │   ├── NavBar.tsx
│   ├── lib/supabase.ts
│   ├── utils/parser.ts
├── supabase/schema.sql
├── middleware.ts
├── next.config.ts
├── package.json
├── tsconfig.json


---

# Diretórios

## `/_docs`

**Responsabilidade**

> Descreva aqui.

**Conteúdo**

* ...

---

## `/public`

**Responsabilidade**

> Descreva aqui.

**Conteúdo**

* ...

---

## `/src`

**Responsabilidade**

> Código-fonte da aplicação.

### `/src/app`

**Responsabilidade**

> Descreva aqui.

### `/src/components`

**Responsabilidade**

> Descreva aqui.

### `/src/hooks`

**Responsabilidade**

> Descreva aqui.

### `/src/lib`

**Responsabilidade**

> Descreva aqui.

### `/src/services`

**Responsabilidade**

> Descreva aqui.

### `/src/types`

**Responsabilidade**

> Descreva aqui.

### `/src/utils`

**Responsabilidade**

> Descreva aqui.

---

## `/tools`

**Responsabilidade**

> Descreva aqui.

### `/tools/ai-context`

**Responsabilidade**

> Descreva aqui.

---

# Arquivos da raiz

| Arquivo          | Responsabilidade |
| ---------------- | ---------------- |
| `middleware.ts`  |                  |
| `next.config.ts` |                  |
| `package.json`   |                  |
| `tsconfig.json`  |                  |
| `.env.local`     |                  |
| `.gitignore`     |                  |

---

# Convenções

## Organização

> Descreva convenções importantes adotadas pelo projeto.

---

## Observações

> Informações relevantes sobre a estrutura física do repositório.
