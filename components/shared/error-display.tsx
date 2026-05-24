import { Button } from "@/components/ui/button";
import { IconMoodSad } from "@tabler/icons-react";

export const ErrorDisplay = () => {
  return (
    <div className="flex flex-col gap-y-4 h-full w-full items-center justify-center">
      <div className="rounded-full bg-primary/10 p-6">
        <IconMoodSad className="h-16 w-16 text-primary" />
      </div>
      <div className="flex flex-col gap-y-1">
        <h2 className="text-2xl font-bold text-center">
          Ops! Ocorreu um erro.
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Tente novamente clicando no botão abaixo.
        </p>
      </div>
      <Button onClick={() => window.location.reload()}>
        Atualizar a página
      </Button>
    </div>
  );
};
