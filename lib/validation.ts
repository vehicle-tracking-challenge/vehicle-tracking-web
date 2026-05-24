/** Mercosul: ABC1D23 (3 letras + dígito + letra + 2 dígitos) */
const PLATE_MERCOSUL = /^[A-Za-z]{3}[0-9][A-Za-z][0-9]{2}$/;

/** Padrão antigo: ABC1234 ou ABC-1234 */
const PLATE_OLD = /^[A-Za-z]{3}-?[0-9]{4}$/;

/**
 * Valida placa de veículo nos padrões Mercosul (ABC1D23)
 * e padrão antigo brasileiro (ABC1234 ou ABC-1234).
 */
export const isValidPlate = (plate: string): boolean =>
  PLATE_MERCOSUL.test(plate) || PLATE_OLD.test(plate);

/**
 * Formata input de placa enquanto o usuário digita.
 * - Remove caracteres inválidos e converte para maiúsculas.
 * - Padrão antigo (3 letras + só dígitos): insere traço → ABC-1234.
 * - Mercosul (letra na posição 4): sem traço → ABC1D23.
 */
export const formatPlateInput = (raw: string): string => {
  const clean = raw
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 7);

  if (clean.length > 3 && /^[A-Z]{3}[0-9]+$/.test(clean)) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }

  return clean;
};
