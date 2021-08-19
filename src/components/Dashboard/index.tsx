import { Summary } from "../Summary";
import { TransactionTable } from "../TransactionTable";
import { Container } from "./styles";

//Prop drilling -> repasse de props para várias camadas (Não fazer isso!!!)
// Quando precisamos compartilhar um estado um pouco mais complexo, geralmente
// Utilizamos Contexto --> Compartilhamento de estado entre vários componentes da aplicação
// Com Contexto é possível acessar estados de qualquer componente da aplicação independente daonde estejam

export function Dashboard() {
  return (
    <Container>
      <Summary />
      <TransactionTable />
    </Container>
  );
}