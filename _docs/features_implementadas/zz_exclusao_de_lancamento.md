# Exclusão de Lançamento

## O que o Usuário Consegue Fazer

O usuário consegue remover um lançamento já registrado. Ao fazer isso, todas as parcelas e transações vinculadas àquele lançamento são removidas automaticamente junto, sem que o usuário precise apagar cada uma manualmente.

## Pontos de Entrada no Sistema

- `/lancamentos`, ícone de lixeira em cada item da lista de "Últimas Movimentações".

## Regras de Negócio Observadas

- Antes de excluir, o sistema pede confirmação via caixa de diálogo do navegador, com o texto: "Remover este lançamento? Isso apagará automaticamente todas as parcelas e transações vinculadas."
- A exclusão feita pelo código afeta diretamente apenas a tabela `lancamentos` (`supabase.from('lancamentos').delete().eq('id', id)`).
- A remoção em cascata das transações vinculadas não é feita explicitamente pelo código da página — ela depende da regra `ON DELETE CASCADE` definida na constraint `transacoes_lancamento_id_fkey` no banco de dados (confirmada em `supabase/schema.sql`).
- Após a exclusão, a lista de lançamentos é recarregada.

## Limitações Observadas

- Não é possível excluir apenas uma parcela específica de um lançamento parcelado a partir desta tela — a exclusão é sempre do lançamento inteiro e de tudo o que está vinculado a ele.
- Não há "lixeira" ou possibilidade de desfazer a exclusão depois de confirmada.
- Quando o lançamento excluído tinha transações vinculadas a uma fatura, a fatura em si não é removida nem recalculada — apenas as transações somem; não há tratamento observado para faturas que ficam vazias.

## Relação com Outras Features

- Opera sobre dados criados pelo **Registro de Lançamento**.
- Quando o lançamento excluído envolvia cartão de crédito, afeta indiretamente o que aparece no **Painel de Faturas** (a transação correspondente deixa de existir).

## Pergunta Central Relacionada

Nenhuma conexão direta com as perguntas financeiras centrais listadas em `00_context.md`. É uma capacidade de manutenção/correção dos dados.

## Relação com o Backlog

Não há item específico em `03_backlog.md` para esta capacidade isoladamente; ela está implícita no escopo geral de F06/lançamentos.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada — o comportamento de cascata é confirmável diretamente pela constraint no `supabase/schema.sql`, disponível no contexto.
