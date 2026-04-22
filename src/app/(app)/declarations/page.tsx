import { DeclarationsWorkspace } from "@/components/declarations/declarations-workspace";
import { declarations } from "@/lib/mock/declarations";

export default function DeclarationsPage() {
  return <DeclarationsWorkspace initialDeclarations={declarations} />;
}
