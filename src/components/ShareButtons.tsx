import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
}

const ShareButtons = ({ 
  url = window.location.href,
  title = "Esthela Damián Peralta - Súmate al Cambio para Guerrero 2027",
  description = "Forma parte de la estructura que transformará Guerrero con honestidad, trabajo y resultados."
}: ShareButtonsProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);
    window.open(`https://wa.me/527474795833?text=${text}`, '_blank');
    
    // Track share event
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: 'WhatsApp',
          content_type: 'website',
          item_id: url
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Share', { method: 'WhatsApp' });
      }
    }
  };

  const handleFacebookShare = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    
    // Track share event
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: 'Facebook',
          content_type: 'website',
          item_id: url
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Share', { method: 'Facebook' });
      }
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
    
    // Track share event
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: 'Twitter',
          content_type: 'website',
          item_id: url
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Share', { method: 'Twitter' });
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace ha sido copiado al portapapeles.",
      });
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy link event
      if (typeof window !== 'undefined') {
        if ((window as any).gtag) {
          (window as any).gtag('event', 'share', {
            method: 'Copy Link',
            content_type: 'website',
            item_id: url
          });
        }
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Share', { method: 'Copy Link' });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      <p className="text-sm font-semibold text-muted-foreground w-full text-center mb-2">
        Comparte este movimiento:
      </p>
      
      <Button
        onClick={handleWhatsAppShare}
        size="lg"
        className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        WhatsApp
      </Button>

      <Button
        onClick={handleFacebookShare}
        variant="outline"
        size="lg"
        className="gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
      >
        <Facebook className="w-5 h-5" />
        Facebook
      </Button>

      <Button
        onClick={handleTwitterShare}
        variant="outline"
        size="lg"
        className="gap-2 hover:bg-[#000000] hover:text-white hover:border-[#000000] transition-colors"
      >
        <Twitter className="w-5 h-5" />
        X/Twitter
      </Button>

      <Button
        onClick={handleCopyLink}
        variant="outline"
        size="lg"
        className="gap-2"
      >
        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        {copied ? "¡Copiado!" : "Copiar enlace"}
      </Button>
    </div>
  );
};

export default ShareButtons;
