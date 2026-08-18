# MISSÃO DE ENCERRAMENTO DE FEATURE

## Objetivo

Você vai encerrar formalmente um item do backlog que o usuário confirmou estar concluído e testado em execução real. Esta missão é deliberadamente simples e mecânica — não envolve reavaliação de conteúdo, apenas atualização de status e reorganização de arquivos.

Você não deve:

* reescrever, resumir ou reformular qualquer parte do conteúdo já existente no arquivo do item;
* reabrir critérios de aceite, decisões técnicas ou de UX já registradas;
* proceder sem confirmação explícita do usuário de que a feature foi testada e está de fato concluída.

---

## Entrada

ID do item a ser encerrado: `<ID DO ITEM>`

Confirmação do usuário de que a implementação foi testada em execução real e está funcionando conforme especificado: `<SIM/NÃO — NÃO PROSSIGA SEM ESTA CONFIRMAÇÃO>`

---

## Processo

1. Localize o arquivo do item em `_docs/backlog/<ID>_<nome_curto>.md`.
2. No próprio arquivo, altere apenas o campo `Status`, de seu valor atual para `Concluída`, e adicione um campo `Data de Conclusão: <data de hoje>` logo abaixo dele. Não altere mais nada no conteúdo do arquivo.
3. Prepare o arquivo para ser movido de `_docs/backlog/` para `_docs/features_implementadas/`, mantendo exatamente o mesmo nome de arquivo (`<ID>_<nome_curto>.md`) — sem renomear.
4. No índice de `_docs/backlog/00_indice.md`, **não remova a linha do item**. Apenas atualize a coluna `Status` para `Concluída` e preencha a coluna `Data de Conclusão`. O índice do backlog é o registro histórico completo de tudo que já passou por ali, concluído ou não, e deve permanecer com uma linha por item para sempre.
5. Adicione a linha correspondente ao item em `_docs/features_implementadas/00_indice.md`, seguindo o formato de tabela já usado lá.

---

## Formato de Saída

**Arquivo do Item — Atualizado**
Conteúdo completo do arquivo `<ID>_<nome_curto>.md`, idêntico ao original exceto pelos campos `Status` e `Data de Conclusão` atualizados. Indique que este arquivo deve ser movido para `_docs/features_implementadas/<ID>_<nome_curto>.md` no repositório (removido de `_docs/backlog/`).

**Linha Atualizada em `_docs/backlog/00_indice.md`**
A linha do item, com `Status` e `Data de Conclusão` atualizados, para o usuário substituir a linha correspondente no índice.

**Linha Nova em `_docs/features_implementadas/00_indice.md`**
A linha a ser adicionada nesse índice.

---

## Critérios de Qualidade

Antes de concluir, confirme que:

* a confirmação do usuário de que a feature foi testada foi recebida antes de qualquer alteração;
* nenhum conteúdo do arquivo do item foi reescrito, resumido ou reformulado — apenas `Status` e `Data de Conclusão` foram adicionados/alterados;
* a linha do item no índice do backlog foi atualizada, não removida;
* o nome do arquivo permanece idêntico em sua nova localização.