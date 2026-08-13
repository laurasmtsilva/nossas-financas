# Gestão de Categorias

## O que o Usuário Consegue Fazer

O usuário consegue criar categorias para classificar suas receitas e despesas (por exemplo, "Alimentação", "Transporte"), organizá-las em até dois níveis — uma categoria principal e, dentro dela, subcategorias — escolher um ícone visual para cada categoria, visualizar tudo organizado separadamente em blocos de "Receitas" e "Despesas", e excluir categorias que não são mais necessárias.

## Pontos de Entrada no Sistema

- `/categorias`, tela principal de gestão.
- Também é possível criar uma nova categoria "no meio do caminho" durante um lançamento — ver feature própria **Cadastro Rápido de Categoria Durante o Lançamento**.

## Regras de Negócio Observadas

- Toda categoria precisa ter um tipo, que só pode ser "RECEITA" ou "DESPESA" (validado tanto na interface quanto por constraint no banco).
- Uma categoria pode ter uma categoria "pai" (`parent_id`), formando uma hierarquia; o banco garante, através de uma chave estrangeira composta (`parent_id` + `tipo`), que uma subcategoria sempre tenha o mesmo tipo da categoria pai.
- O nome de uma categoria precisa ser único dentro do mesmo nível (mesma categoria pai ou mesma ausência de pai) — constraint `unique_nome_por_nivel` no banco.
- Cada categoria tem um ícone associado (campo `icone`); se o nome do ícone não for reconhecido pelo componente responsável por exibi-lo (`IconeCategorias`), o ícone "Folder" é usado como substituto visual.
- Ao excluir uma categoria "pai", todas as suas subcategorias são excluídas automaticamente em cascata (constraint `fk_parent_id_tipo` com `ON DELETE CASCADE`).
- Ao excluir qualquer categoria, todos os lançamentos vinculados a ela também são excluídos automaticamente em cascata (constraint `lancamentos_categoria_id_fkey` com `ON DELETE CASCADE`) — esse efeito não é mencionado na mensagem de confirmação exibida ao usuário, que apenas pergunta "Excluir esta categoria?".
- A interface permite expandir e recolher tanto os blocos gerais de "RECEITAS"/"DESPESAS" quanto cada categoria pai individualmente.
- A lista de ícones disponíveis para seleção é fixa, com 22 opções pré-definidas (`ICONES_DISPONIVEIS`).

## Limitações Observadas

- Não há edição de uma categoria já criada (nome, tipo, ícone ou categoria pai) — apenas criação e exclusão.
- A hierarquia é limitada a dois níveis (categoria e subcategoria); não há suporte observado a subcategoria dentro de subcategoria.
- A mensagem de confirmação de exclusão não avisa que lançamentos vinculados também serão apagados.

## Relação com Outras Features

- Categorias cadastradas aqui são usadas no **Registro de Lançamento**.
- Compartilha a mesma tabela e as mesmas regras do **Cadastro Rápido de Categoria Durante o Lançamento**.

## Pergunta Central Relacionada

Nenhuma conexão direta com as perguntas centrais financeiras listadas em `00_context.md`. Apoia a organização dos dados que, por sua vez, sustentam essas perguntas em outras telas.

## Relação com o Backlog

Não há item específico em `03_backlog.md` chamado "Categorias".

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
