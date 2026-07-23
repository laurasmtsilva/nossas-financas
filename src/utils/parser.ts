export const parseClipboard = (text: string) => {
  // 1. Extração de Data (procura pelo padrão DD/MM)
  const dataMatch = text.match(/(\d{2}\/\d{2})/);
  
  // 2. Extração de Estabelecimento/Descrição
  // Busca o texto entre "em " e a primeira "," ou " R$"
  const descMatch = text.match(/em\s+(.+?)(?:,|\sR\$)/i);
  
  // 3. Extração de Valor
  // Busca "R$" seguido de QUALQUER quantidade de espaços (\s*) e depois os números
  const valorMatch = text.match(/R\$\s*([\d.,]+)/);
  
  let valorFinal = null;
  if (valorMatch) {
    // Removemos pontos de milhar, substituímos a vírgula por ponto
    // Ex: "1.234,56" -> "1234.56"
    const rawValue = valorMatch[1].replace(/\./g, '').replace(',', '.');
    valorFinal = parseFloat(rawValue);
  }

  return {
    valor: isNaN(valorFinal!) ? null : valorFinal,
    data: dataMatch ? dataMatch[0] : new Date().toLocaleDateString('pt-BR').substring(0, 5),
    descricao: descMatch ? descMatch[1].trim() : "Lançamento colado"
  };
};