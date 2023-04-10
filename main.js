import 'leaflet/dist/leaflet.css';
import './css/style.css';
import './css/id.css';

import { coreContext } from './modules/core/index.js';

const container = document.querySelector('#app');
const context = coreContext()
  .containerNode(container);
context.init();
