
export function operationDelete(context, selectedIDs) {

  const operation = function() {

  }

  operation.tooltip = function() {
    const disable = operation.disabled();
    const text = disable ? '彻底删除该要素' : '该要素可见部分不足，无法将其删除'
    return function(selection) {
      return selection.append('span').attr('class', 'localized-text').text(text);
    }
  }

  operation.disabled = function() {
    return false;
  }

  operation.id = 'delete';
  operation.keys = [];
  operation.title = 'operations.delete.title';

  return operation;
}
