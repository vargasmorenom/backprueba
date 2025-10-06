-- FUNCTION: public.actualizar_fondo()

-- DROP FUNCTION IF EXISTS public.actualizar_fondo();

CREATE OR REPLACE FUNCTION public.actualizar_fondo()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
  tipo_nombre TEXT;
  operacion CHAR;
BEGIN
  SELECT nombre INTO tipo_nombre FROM tipos_movimientos WHERE id = NEW.tipo_movimiento_id;

  IF tipo_nombre ILIKE '%deposit%' OR tipo_nombre ILIKE '%ingreso%' THEN
    operacion := '+';
  ELSIF tipo_nombre ILIKE '%retiro%' OR tipo_nombre ILIKE '%salida%' THEN
    operacion := '-';
  ELSE
    RAISE NOTICE 'Tipo de movimiento no reconocido: %', tipo_nombre;
    RETURN NEW;
  END IF;

  IF operacion = '+' THEN
    UPDATE fondos_users SET fondo = fondo + NEW.monto WHERE id = NEW.fondo_user_id;
  ELSE
    UPDATE fondos_users SET fondo = fondo - NEW.monto WHERE id = NEW.fondo_user_id;
  END IF;

  RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.actualizar_fondo()
    OWNER TO milton;
