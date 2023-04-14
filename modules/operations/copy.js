export function operationCopy(context, selectedIDs) {

  const operation = function() {

  }

  operation.disabled = function() {
    return false;
  }

  operation.id = 'copy';
  operation.keys = [];
  operation.title = 'operations.copy.title';

  return operation;
}
