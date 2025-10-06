import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";

const RegistrationProgress = () => {
  const { data: count } = useQuery({
    queryKey: ['registrations-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('registros' as any)
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  const formattedCount = (count || 0).toLocaleString('es-MX');
  const progressPercentage = Math.min((count || 0) / 100, 100); // Ajusta el divisor según tu meta

  return (
    <div className="py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-elegant">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="text-2xl md:text-3xl font-bold text-center">
                <span className="text-primary">{formattedCount}</span> personas ya se han sumado
              </h3>
            </div>
            <p className="text-center text-lg text-muted-foreground mb-6">
              a la estructura política de Guerrero
            </p>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationProgress;
