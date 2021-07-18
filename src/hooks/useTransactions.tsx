import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  category: string;
  createdAt: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

type SummaryType = {
  incomes: number;
  outcomes: number;
  total: number;
}

type TransactionsContextType = {
  transactions: Transaction[];
  summary: SummaryType;
  createTransaction: (input: TransactionInput) => Promise<void>;
};

const TransactionsContext = createContext({} as TransactionsContextType);

type TransactionsContextProviderProps = {
  children: ReactNode;
};

export function TransactionsContextProvider(props: TransactionsContextProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<SummaryType>({
    incomes: 0,
    outcomes: 0,
    total: 0,
  });

  useEffect(() => {
    api('/transactions')
      .then(response => {
        setTransactions(response.data.transactions);
      });
  }, []);

  useEffect(() => {
    const summary = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'deposit') {
        acc.incomes += transaction.amount;
        acc.total += transaction.amount;
      }
      if (transaction.type === 'withdrawal') {
        acc.outcomes += transaction.amount;
        acc.total -= transaction.amount;
      }
      return acc;
    }, {
      incomes: 0,
      outcomes: 0,
      total: 0,
    });
    setSummary(summary);
  }, [transactions]);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date(),
    });

    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider value={{
      transactions,
      summary,
      createTransaction
    }}>
      {props.children}
    </TransactionsContext.Provider>
  );

};

export function useTransactions() {
  const context = useContext(TransactionsContext);
  return context;
}
