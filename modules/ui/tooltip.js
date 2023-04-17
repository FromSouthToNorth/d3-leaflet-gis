import { utilFunctor} from '../util/index.js';
import { uiPopover } from './popover.js';

export function uiTooltip(klass) {
  const tooltip = uiPopover((klass || '') + ' tooltip')
    .displayType('hover');

  let _title = function() {
    let title = this.getAttribute('data-original-title');
    if (title) {
      return title;
    }
    else {
      title = this.getAttribute('title');
      this.removeAttribute('title');
      this.setAttribute('data-original-title', title);
    }
    return title;
  }

  let _heading = utilFunctor(null);
  let _keys = utilFunctor(null);

  tooltip.title = function(val) {
    if (!arguments.length) return _title;
    _title = utilFunctor(val);
    return tooltip;
  }

  tooltip.heading = function(val) {
    if (!arguments.length) return _heading;
    _heading = utilFunctor(val);
    return tooltip;
  }

  tooltip.keys = function(val) {
    if (!arguments.length) return _keys
    _keys = utilFunctor(val);
    return tooltip;
  }

  return tooltip;
}
