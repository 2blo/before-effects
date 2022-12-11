export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]
// @typescript-eslint:disable-next-line
export interface Database {} // tslint:disable-line