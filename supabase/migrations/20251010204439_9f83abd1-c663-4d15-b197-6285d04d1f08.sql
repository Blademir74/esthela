-- Agregar campo opcional para intereses políticos
ALTER TABLE public.registros 
ADD COLUMN intereses_politicos text;

-- Agregar comentario para documentación
COMMENT ON COLUMN public.registros.intereses_politicos IS 'Campo opcional para que los usuarios indiquen sus intereses políticos o áreas de participación';