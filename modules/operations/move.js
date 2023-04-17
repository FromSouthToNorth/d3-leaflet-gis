
export function operationMove(context, selectedIDs) {

  const operation = function() {

  }

  operation.tooltip = function() {
    const disable = operation.disabled();
    const text = disable ? '移动该要素' : '该要素可见部分不足，无法将其移动'
    return function(selection) {
      return selection.append('span').attr('class', 'localized-text').text(text);
    }
  }

  operation.disabled = function() {
    return false;
  }

  operation.id = 'move';
  operation.keys = [];
  operation.title = 'operations.move.title';

  return operation;
}
