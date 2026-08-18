# Preenchimento Automático a partir de SMS Colado

## O que o Usuário Consegue Fazer

Ao receber um SMS de notificação de compra (por exemplo, de um banco ou operadora de cartão), o usuário pode copiar o texto e colá-lo no sistema com um clique. O sistema tenta identificar automaticamente a descrição do estabelecimento, o valor gasto e a data da compra, preenchendo esses campos no formulário de lançamento sem que o usuário precise digitá-los manualmente.

## Pontos de Entrada no Sistema

- `/lancamentos`, botão "Colar SMS".
- Lógica de extração implementada em `src/utils/parser.ts` (função `parseClipboard`).
- Existe também uma página de verificação técnica deste comportamento em `/teste-parser` (ver feature "Ferramenta Interna de Teste do Parser").

## Regras de Negócio Observadas

- O texto é lido diretamente da área de transferência do dispositivo via `navigator.clipboard.readText()`.
- **Data**: o parser procura um padrão no formato `DD/MM` em qualquer parte do texto; se não encontrar, assume a data atual do sistema. O ano usado é sempre o ano corrente — o parser não extrai nem interpreta o ano a partir do texto.
- **Descrição**: o parser procura o texto que aparece entre a palavra "em " e a próxima vírgula ou " R$"; se não encontrar esse padrão, usa o texto fixo "Lançamento colado". O resultado é reformatado no formulário, capitalizando a primeira letra de cada palavra.
- **Valor**: o parser procura "R$" seguido de números (aceitando qualquer quantidade de espaços entre "R$" e o número), remove o separador de milhar (ponto) e troca a vírgula decimal por ponto, convertendo para número.
- Se a leitura da área de transferência falhar (por exemplo, permissão negada pelo navegador), o sistema exibe a mensagem "❌ Erro ao ler a área de transferência." e não altera o formulário.

## Limitações Observadas

- Depende do texto seguir um formato específico (contendo "em ⟨estabelecimento⟩," e "R$ ⟨valor⟩" e uma data "DD/MM"); mensagens em formatos diferentes resultam em campos não preenchidos ou preenchidos com os valores padrão.
- Não identifica automaticamente a categoria da compra.
- Não identifica automaticamente qual cartão foi utilizado, mesmo quando o SMS menciona o cartão (ex: "ELO final 7764").
- Não identifica parcelamento a partir do texto: os exemplos usados na página de teste (`/teste-parser`) incluem uma mensagem com "em 3 vezes", mas o parser não extrai nem preenche o número de parcelas — esse campo continua exigindo preenchimento manual do usuário.
- Falhas de leitura da área de transferência resultam apenas em uma mensagem de erro genérica, sem indicar a causa (ex: permissão negada vs. área de transferência vazia).

## Relação com Outras Features

- Alimenta diretamente o **Registro de Lançamento**, preenchendo campos do mesmo formulário.
- Compartilha a mesma lógica de extração (`parseClipboard`) exibida na **Ferramenta Interna de Teste do Parser**.

## Pergunta Central Relacionada

Apoia indiretamente a pergunta "Posso fazer esta compra?" ao reduzir o esforço de registrar rapidamente uma compra recém-feita, mas não responde a essa pergunta diretamente — apenas acelera o registro do dado.

## Relação com o Backlog

O item F06 aparece de forma inconsistente em `03_backlog.md`: está listado como "✅ Concluída" na seção "FINALIZADOS" ("Lançamento Inteligente por Copiar/Colar") e também aparece novamente na seção "DEFINIDOS" com status "A Fazer" (com o texto ligeiramente diferente, "Copiar/Copiar"). O código evidencia que a funcionalidade básica de colar e extrair dados de um SMS **existe e está implementada**, o que é coerente com o status "Concluída" da seção "FINALIZADOS" — a duplicidade do item na seção "DEFINIDOS" parece ser uma inconsistência do próprio backlog, não uma informação sobre o estado do código.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada — a lógica está inteiramente contida em `src/utils/parser.ts` e seu uso em `src/app/lancamentos/page.tsx`.
