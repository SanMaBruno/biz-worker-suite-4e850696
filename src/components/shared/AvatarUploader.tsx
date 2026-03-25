import { useState, useRef, useCallback } from "react";
import { Camera, Trash2, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AvatarUploaderProps {
  currentUrl?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  onUpload?: (file: File) => Promise<string | void>;
  onRemove?: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

const iconSizeMap = { sm: 18, md: 24, lg: 32 };

function getInitials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUploader({
  currentUrl,
  name,
  size = "lg",
  onUpload,
  onRemove,
  disabled = false,
  className,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || currentUrl;
  const initials = getInitials(name);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Solo se permiten JPG, PNG o WebP");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("La imagen no puede superar los 5 MB");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (onUpload) {
        setUploading(true);
        try {
          await onUpload(file);
        } catch {
          setError("Error al subir la imagen");
          setPreview(null);
        } finally {
          setUploading(false);
        }
      }
    },
    [onUpload],
  );

  const handleRemove = useCallback(async () => {
    setError(null);
    if (onRemove) {
      setUploading(true);
      try {
        await onRemove();
        setPreview(null);
      } catch {
        setError("Error al eliminar la imagen");
      } finally {
        setUploading(false);
      }
    }
  }, [onRemove]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative group">
        <div
          className={cn(
            "rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center transition-all",
            sizeMap[size],
            uploading && "opacity-60",
          )}
        >
          {uploading ? (
            <Loader2 size={iconSizeMap[size]} className="animate-spin text-muted-foreground" />
          ) : displayUrl ? (
            <img src={displayUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : initials ? (
            <span className="text-muted-foreground font-semibold" style={{ fontSize: iconSizeMap[size] * 0.6 }}>
              {initials}
            </span>
          ) : (
            <User size={iconSizeMap[size]} className="text-muted-foreground" />
          )}
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            aria-label="Cambiar foto de perfil"
          >
            <Camera size={iconSizeMap[size] * 0.5} className="text-primary-foreground" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />

      {!disabled && displayUrl && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={uploading}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} />
          Eliminar foto
        </Button>
      )}

      {error && (
        <p className="text-xs text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
