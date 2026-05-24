import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

export const Loading = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoaderIcon
        role="status"
        aria-label="Carregando"
        className={cn("size-8 text-primary animate-spin", className)}
        {...props}
      />
    </div>
  );
};
