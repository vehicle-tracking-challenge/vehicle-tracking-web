import { Info } from "lucide-react";

interface NoDataProps {
  title?: string;
  description?: string;
}

export const NoData = ({
  title = "Nenhum veículo encontrado",
  description = "Não há veículos cadastrados. Clique em 'Novo Veículo' para começar.",
}: NoDataProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center gap-3">
      <Info className="text-primary w-10 h-10" />
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
};
