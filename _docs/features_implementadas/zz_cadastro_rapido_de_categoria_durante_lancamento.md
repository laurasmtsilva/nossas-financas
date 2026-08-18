# Cadastro Rápido de Categoria Durante o Lançamento

## O que o Usuário Consegue Fazer

Enquanto está registrando uma receita ou despesa, se a categoria que o usuário precisa ainda não existir, ele pode criá-la ali mesmo — escolhendo nome, uma categoria "pai" opcional e um ícone — sem precisar sair da tela de lançamento nem perder o que já havia preenchido.

## Pontos de Entrada no Sistema

- `/lancamentos`, dentro do seletor de categoria (dropdown), seção "Cadastro Rápido".

## Regras de Negócio Observadas

- A nova categoria herda automaticamente o tipo (RECEITA ou DESPESA) do lançamento que está sendo criado no momento — não há escolha independente de tipo neste fluxo.
- A lista de categorias "pai" disponíveis para vincular é filtrada para mostrar apenas categorias existentes do mesmo tipo.
- Após a criação bem-sucedida, a categoria recém-criada é automaticamente selecionada como categoria do lançamento em andamento, e o dropdown é fechado.
- Se ocorrer erro na criação, a mensagem de erro retornada pelo Supabase é exibida na área de status da tela.

## Limitações Observadas

- Diferente da tela principal de categorias (onde o ícone inicial selecionado é "Folder"), neste fluxo o ícone começa sem seleção (string vazia); se o usuário não escolher um ícone manualmente, a categoria pode ser criada com o campo `icone` vazio, dependendo apenas do fallback visual do componente `IconeCategorias` (que exibe "Folder" quando o nome do ícone não é reconhecido) para não quebrar a exibição.
- Não é possível, a partir deste fluxo, editar ou excluir uma categoria — apenas criar uma nova.

## Relação com Outras Features

- Utiliza a mesma tabela e as mesmas regras de negócio da **Gestão de Categorias** (mesma constraint de nome único por nível, mesma constraint de tipo).
- O resultado é consumido imediatamente pelo **Registro de Lançamento**.

## Pergunta Central Relacionada

Nenhuma conexão direta com as perguntas centrais financeiras listadas em `00_context.md`. Apoia a organização dos dados, não a resposta a uma pergunta financeira.

## Relação com o Backlog

Não há item específico em `03_backlog.md` para esta capacidade combinada (cadastro de categoria embutido no fluxo de lançamento).

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
