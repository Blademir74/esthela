import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ShareButtons from "@/components/ShareButtons";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    municipio: "",
    intereses_politicos: ""
  });
  const [showShareButtons, setShowShareButtons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.municipio.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos del formulario.",
        variant: "destructive"
      });
      return;
    }

    // Validar formato de teléfono (10 dígitos)
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ""))) {
      toast({
        title: "Teléfono inválido",
        description: "Por favor ingresa un número de teléfono válido de 10 dígitos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Verificar si el nombre ya está registrado
      const { data: existingRegistro } = await supabase
        .from('registros' as any)
        .select('nombre')
        .eq('nombre', formData.nombre.trim())
        .maybeSingle();

      if (existingRegistro) {
        toast({
          title: "🔒 Registro ya completado",
          description: "Tu nombre ya está registrado. ¡Gracias por tu apoyo!",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Guardar en Supabase
      const { error } = await supabase
        .from('registros' as any)
        .insert({
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          municipio: formData.municipio.trim(),
          intereses_politicos: formData.intereses_politicos.trim() || null
        });

      if (error) {
        throw error;
      }
      
      // Track registration event
      if (typeof window !== 'undefined') {
        if ((window as any).gtag) {
          (window as any).gtag('event', 'sign_up', {
            method: 'Website Form'
          });
        }
        if ((window as any).fbq) {
          (window as any).fbq('track', 'CompleteRegistration');
        }
      }
      
      toast({
        title: "¡Gracias por sumarte!",
        description: "Pronto recibirás noticias. Juntos transformaremos Guerrero.",
        className: "text-lg"
      });

      // Mostrar botones de compartir
      setShowShareButtons(true);

      // Limpiar formulario
      setFormData({
        nombre: "",
        telefono: "",
        municipio: "",
        intereses_politicos: ""
      });
    } catch (error) {
      console.error('Error al registrar:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu información. Por favor intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registro" className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Súmate hoy
            </h2>
            <p className="text-lg text-muted-foreground">
              Regístrate y forma parte del movimiento que transformará Guerrero
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 md:p-10 shadow-elegant space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-base font-semibold">
                Nombre completo *
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="h-12 text-base"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-base font-semibold">
                Teléfono *
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="10 dígitos"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="h-12 text-base"
                required
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipio" className="text-base font-semibold">
                Municipio *
              </Label>
              <Input
                id="municipio"
                type="text"
                placeholder="Tu municipio en Guerrero"
                value={formData.municipio}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                className="h-12 text-base"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intereses_politicos" className="text-base font-semibold">
                Intereses políticos (opcional)
              </Label>
              <Textarea
                id="intereses_politicos"
                placeholder="Ej: Educación, salud, seguridad, desarrollo económico, infraestructura..."
                value={formData.intereses_politicos}
                onChange={(e) => setFormData({ ...formData, intereses_politicos: e.target.value })}
                className="min-h-[100px] text-base resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Cuéntanos en qué áreas te gustaría participar o contribuir
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-14 rounded-full shadow-lg hover:scale-105 transition-smooth"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Quiero unirme"
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Al registrarte, aceptas que tus datos serán utilizados únicamente para contacto político y no serán compartidos con terceros.
            </p>

            {/* Kit informativo download */}
            <div className="pt-4 border-t">
              <a 
                href="/kit-informativo.pdf" 
                download
                onClick={() => {
                  // Track PDF download event
                  if (typeof window !== 'undefined') {
                    if ((window as any).gtag) {
                      (window as any).gtag('event', 'file_download', {
                        file_name: 'kit-informativo.pdf',
                        file_extension: 'pdf'
                      });
                    }
                    if ((window as any).fbq) {
                      (window as any).fbq('track', 'Lead');
                    }
                  }
                }}
                className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                <Download className="w-5 h-5" />
                Descargar Kit Informativo (PDF)
              </a>
            </div>

            {/* Share buttons after successful registration */}
            {showShareButtons && (
              <div className="pt-6 border-t">
                <ShareButtons />
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
