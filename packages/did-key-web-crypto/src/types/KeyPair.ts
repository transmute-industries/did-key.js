import { Base58KeyPair } from './Base58KeyPair';
export interface KeyPair extends Base58KeyPair {
  id: string;
  type: string;
  controller: string;
}
