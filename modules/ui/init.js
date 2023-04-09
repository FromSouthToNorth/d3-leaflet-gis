import { behaviorHash } from '../behavior/hash.js';
import { svgAreas } from '../svg/areas.js';
import { svgPoints } from '../svg/points.js';
import { svgLabels } from '../svg/labels.js';
import { behaviorHover } from '../behavior/index.js';

export function uiInit(context) {

  function render(container) {

    const map = context.map();
    const content = container.append('div')
      .attr('class', 'main-content active');
    content.call(map);

    context.overlayPaneSvg =
      map.overlayPane();

    const drawAreas = svgAreas(map.projection(), context);
    drawAreas(context.overlayPaneSvg);

    const drawPoints = svgPoints(map.projection(), context);
    drawPoints(context.overlayPaneSvg);

    const drawLabels = svgLabels(map.projection(), context);
    drawLabels(context.overlayPaneSvg);

    const _behaviors = [
      behaviorHover(context),
    ];

    _behaviors.forEach(context.install);

    ui.hash = behaviorHash(context);
    ui.hash();
  }

  let ui = {};

  let _loadPromise;

  ui.ensureLoaded = () => {
    return _loadPromise = Promise.all(
      [],
    )
      .then(() => {
        if (!context.container()
          .empty()) {
          render(context.container());
        }
      })
      .catch(err => console.error(err));
  };

  return ui;
}