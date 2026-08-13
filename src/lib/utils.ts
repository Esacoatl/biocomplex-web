import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** twMerge(clsx(...)) — permite que el consumidor gane el conflicto vía className. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
