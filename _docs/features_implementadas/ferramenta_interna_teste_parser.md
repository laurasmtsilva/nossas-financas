# Ferramenta Interna de Teste do Parser de SMS

## O que o Usuário Consegue Fazer

Nada é feito pelo usuário aqui de forma interativa. Esta é uma página técnica que exibe, lado a lado, quatro exemplos fixos de texto de SMS e o resultado (em formato JSON) que o mecanismo de leitura automática de SMS produziria para cada um deles. Não faz parte do fluxo de uso do produto pelas personas descritas em `00_context.md`.

## Pontos de Entrada no Sistema

- `/teste-parser`.

## Regras de Negócio Observadas

- A página não possui nenhum campo de entrada nem interação do usuário — apenas renderiza uma tabela estática com os quatro textos de exemplo definidos diretamente no código e o resultado de `parseClipboard` (a mesma função usada em produção) para cada um.

## Limitações Observadas

- Não há link para esta página em nenhum ponto do menu de navegação (`Navbar`) observado.
- A página está sujeita ao mesmo middleware geral de autenticação de todas as outras rotas (exige usuário logado), mas não há nenhuma restrição adicional específica para uma página de teste/depuração.

## Relação com Outras Features

- Valida, com exemplos fixos, o comportamento do mesmo mecanismo usado na feature **Preenchimento Automático via SMS**.

## Pergunta Central Relacionada

Nenhuma. É uma ferramenta de apoio ao desenvolvimento/depuração, não uma capacidade de negócio entregue ao usuário final.

## Relação com o Backlog

Não há item correspondente em `03_backlog.md` — esta página não aparece descrita como entregável de nenhum épico.

## Questões em Aberto

Nenhuma lacuna de arquivo identificada.
