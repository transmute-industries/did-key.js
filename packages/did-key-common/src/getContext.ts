import { DidDocument } from './types';

import * as dc from '@transmute/did-context';
import { securityVocabTypeToContext } from './securityVocabTypeToContext';
export const getContext = (didDocument: DidDocument) => {
  const context: string[] = [dc.constants.DID_CONTEXT_V1_URL];
  didDocument.verificationMethod?.forEach(vm => {
    if (!securityVocabTypeToContext[vm.type]) {
      throw new Error(
        'Cannot generate context for unregistered verification method type: ' +
          vm.type
      );
    }
    const typeContext = securityVocabTypeToContext[vm.type];
    if (!context.includes(typeContext)) {
      context.push(typeContext);
    }
  });

  return context;
};
