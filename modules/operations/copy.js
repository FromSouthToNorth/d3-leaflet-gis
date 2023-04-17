export function operationCopy(context, selectedIDs) {

  const operation = function() {

  }

  operation.tooltip = function() {
    const disable = operation.disabled();
    const text = disable ? '设置这些要素从而进行粘贴' : '没有要素已被复制'
    return function(selection) {
      return selection.append('span').attr('class', 'localized-text').text(text);
    }
  }

  operation.disabled = function() {
    return false;
  }

  operation.id = 'copy';
  operation.keys = [];
  operation.title = 'operations.copy.title';

  return operation;
}
