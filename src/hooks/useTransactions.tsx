import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { api } from '../services/api';

//Para que os componentes tenham acesso ao Contexto, é necessário colocar um Provider por volta deles
//Como esse Contexto de Transações pode ser usado por vários componentes conforme escalabilidade, 
//é recomendado colocar por volta do App

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

// interface TransactionInput {
//   title: string;
//   amount: number;
//   type: string;
//   category: string;
// }
// Ou fazer conforme os código abaixo (equivalente)

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
// Ou
// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>

interface TransactionProviderProps {
  //React Node aceita qualquer tipo de elemento como filho
  children: ReactNode
}

interface TransactionsContextData {
  transactions: Transaction[],
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

// Não tem como corrigir o erro de {} que dá, só apenas um pelativo
const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);


export function TransactionsProvider({ children }: TransactionProviderProps){
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  useEffect(() => {
    api.get('transactions')
    .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInput: TransactionInput){
   const response = await api.post('/transactions', {
     ...transactionInput,
     createdAt: new Date()
   });
   const { transaction } = response.data;

   //Atenção para o vetor como que funciona o spred operator
   setTransactions([
     ...transactions,
     transaction
   ])
  };

  //para que o TransactionsProvider tenha Chidren é necessário criar uma interface de Props

  return (
    //Para passar mais de uma informação pelo Provider é necessário colocar duas chaves para transformar em objeto
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}

//Um hook no React sempre pode utilizar outros hooks

export function useTransactions(){
  const context = useContext(TransactionsContext);

  return context;
}