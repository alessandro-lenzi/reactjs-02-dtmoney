import { Transaction, useTransactions } from "../../hooks/useTransactions";
import { Container } from "./styles";

export function TransactionsTable() {
  const transactionsContext = useTransactions();

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const printAmount = ( transaction: Transaction ) => {
    const amount = transaction.amount * (transaction.type === 'deposit' ? 1 : -1);
    return currencyFormatter.format(amount);
  };

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {transactionsContext.transactions.map(transaction => (
          <tr key={transaction.id}>
            <td>{transaction.title}</td>
            <td className={transaction.type}>
              {printAmount(transaction)}
            </td>
            <td>{transaction.category}</td>
            <td>
              {new Intl.DateTimeFormat('pt-BR').format(new Date(transaction.createdAt))}
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
