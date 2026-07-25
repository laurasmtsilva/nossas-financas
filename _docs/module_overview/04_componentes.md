# Componentes

## Objetivo

O módulo de Componentes reúne componentes React reutilizáveis utilizados pela interface da aplicação.

No estado atual do sistema, o módulo é composto por dois componentes:

- `Navbar`
- `IconeCategorias`

Além deles, um dos componentes depende do cliente Supabase disponibilizado por `src/lib/supabase.ts` para executar operações de autenticação.

---

# O que Existe

## Arquivos principais

### `src/components/Navbar.tsx`

Componente responsável pela barra de navegação da aplicação.

Responsabilidades observadas:

- exibir links de navegação;
- destacar a rota atualmente ativa;
- disponibilizar ação de logout;
- navegar para a tela inicial após o logout.

Dependências observadas:

- `next/link`
- `next/navigation`
- `@/lib/supabase`

---

### `src/components/IconeCategorias.tsx`

Componente responsável por renderizar dinamicamente ícones da biblioteca `lucide-react`.

O módulo também exporta:

- `ICONES_DISPONIVEIS`

que consiste em uma lista fixa dos nomes de ícones aceitos pelo sistema.

Dependências observadas:

- `lucide-react`

---

## Serviço relacionado

### `src/lib/supabase.ts`

Exporta uma instância do cliente Supabase criada por `createBrowserClient`, utilizando as variáveis de ambiente:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Essa instância é utilizada pelo `Navbar` para realizar o logout do usuário.

---

# Como Funciona

## Navbar

O componente utiliza o pathname atual da aplicação para determinar qual item de navegação corresponde à rota ativa.

Os links são renderizados utilizando o componente `Link` do Next.js.

Quando o usuário aciona o logout:

1. o componente chama `supabase.auth.signOut()`;
2. após a conclusão da operação, realiza navegação programática para a rota `/`.

Não foram observados estados internos relevantes além da utilização do pathname e do router fornecidos pelo Next.js.

---

## IconeCategorias

O componente recebe:

- o nome de um ícone;
- quaisquer propriedades compatíveis com componentes Lucide.

O nome recebido é utilizado para localizar dinamicamente um componente dentro da coleção exportada por `lucide-react`.

Quando o ícone existe:

- ele é renderizado com as propriedades recebidas.

Quando não existe:

- é renderizado o ícone `Folder` como fallback.

O módulo também disponibiliza uma lista fixa (`ICONES_DISPONIVEIS`) contendo os nomes de ícones previstos para utilização pela aplicação.

---

# Relação com o Restante do Sistema

O módulo Componentes estabelece as seguintes integrações observadas.

## Com Next.js

O `Navbar` utiliza:

- `Link`;
- `usePathname`;
- `useRouter`.

Essas dependências permitem:

- navegação entre páginas;
- identificação da rota ativa;
- redirecionamento após logout.

---

## Com a infraestrutura de autenticação

O `Navbar` utiliza o cliente exportado por `src/lib/supabase.ts`.

A única operação observada é:

- `supabase.auth.signOut()`.

---

## Com a biblioteca de ícones

O `IconeCategorias` depende diretamente de `lucide-react`.

Os componentes gráficos são obtidos dinamicamente pelo nome informado ao componente.

---

# Questões em Aberto

Nenhuma.

Com base nas evidências disponíveis, foi possível identificar todos os componentes existentes no módulo, suas responsabilidades observáveis, suas dependências e suas integrações externas.