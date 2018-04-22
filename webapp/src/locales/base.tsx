export type Locale = { [key: string]: string }
export type Localiser =
  (key: string, fallback?: string, ...args: any[]) => string
