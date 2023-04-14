
export function operationDelete(context, selectedIDs) {

  const operation = function() {

  }

  operation.disabled = function() {
    return false;
  }


  operation.id = 'delete';
  operation.key = [];
  operation.title = 'operations.delete.title';

  return operation;
}
