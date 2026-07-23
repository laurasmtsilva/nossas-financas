export function buildHeader(): string {
  return `# CONTEXTO DA TAREFA

Esta mensagem está dividida em duas partes.

PARTE 1 — INSTRUÇÕES DO AGENTE

Contém as instruções que orientam sua atuação nesta tarefa.

Essas instruções têm prioridade sobre todo o restante da mensagem.

PARTE 2 — ARTEFATOS DO PROJETO

Contém documentos e arquivos de código utilizados como fonte de verdade durante esta tarefa.

Cada artefato está delimitado por marcadores BEGIN ARTIFACT e END ARTIFACT.

Considere que todos os artefatos apresentados nesta mensagem estão disponíveis integralmente durante toda a tarefa.

Nunca afirme que perdeu acesso ao conteúdo de um artefato fornecido nesta mensagem.

================================================================
INÍCIO DAS INSTRUÇÕES
================================================================

`;
}

export function buildArtifactsHeader(): string {
  return `
================================================================
INÍCIO DOS ARTEFATOS
================================================================

`;
}

export function buildFooter(): string {
  return `
================================================================
FIM DOS ARTEFATOS
================================================================
`;
}