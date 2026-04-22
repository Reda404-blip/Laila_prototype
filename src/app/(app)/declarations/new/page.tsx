import { NewDeclarationForm } from "@/components/declarations/new-declaration-form";
import { clients } from "@/lib/mock/clients";

export default function NewDeclarationPage() {
  return (
    <NewDeclarationForm
      clients={clients.map((client) => ({
        id: client.id,
        tradeName: client.tradeName,
        legalName: client.legalName,
        clientType: client.clientType,
        legalForm: client.legalForm,
        city: client.city,
        accountManager: client.accountManager,
        reviewer: client.reviewer,
      }))}
    />
  );
}
