import { DidDocument } from './DidDocument';

export interface ResolutionResponse {
  didDocument: DidDocument;
  didDocumentMetadata?: any;
  didResolutionMetadata?: any;
}
