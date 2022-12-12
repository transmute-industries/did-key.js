import { DidDocumentRepresentation } from './DidDocumentRepresentation';
export interface ResolutionOptions {
  accept: DidDocumentRepresentation;
  enableEncryptionKeyDerivation?: boolean;
}
