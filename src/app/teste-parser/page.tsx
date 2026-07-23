import { parseClipboard } from '@/utils/parser';

export default function TestePage() {
  const exemplos = [
    "CAIXA: Compra aprovada em IFD*IFOOD CLUB, R$ 1,00, 11/07 as 08:25. ELO final 7764.",
    "CAIXA: Compra aprovada em NET PGT*Fatura Claro, R$ 125,44, 30/06 as 13:24. ELO VIRTUAL final 3738.",
    "CAIXA: Compra aprovada em APPLE.COM/BILL, R$ 5,90, 29/06 as 15:17. VISA VIRTUAL final 8995.",
    "CAIXA: Compra aprovada em RDSAUDE ONLINE R$       398,19 em   3 vezes, 25/06 as 16:13, ELO final 7764."
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Resultados do Parser (F06)</h1>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Entrada (SMS)</th>
            <th>Resultado (JSON)</th>
          </tr>
        </thead>
        <tbody>
          {exemplos.map((texto, i) => (
            <tr key={i}>
              <td style={{ padding: '8px' }}>{texto}</td>
              <td style={{ padding: '8px' }}>
                <pre>{JSON.stringify(parseClipboard(texto), null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}