import L from 'leaflet';
import { getIcon } from './eventIcons.js';
import { BIBLE_SPRITE_VARIANT, getBibleEventSpriteStyleAttr } from '../utils/bibleEventSprites.js';

const cache = new Map();
const MAX_CACHE = 220;

function trimCache() {
  while (cache.size > MAX_CACHE) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
}

/**
 * @param {{ id: string; mapIcon?: string; order?: number; title?: string }} event
 * @param {boolean} isSelected
 * @param {boolean} [isMuted] — de-emphasize when timeline filters other eras
 */
export function getStoryMarkerIcon(event, isSelected, isMuted = false) {
  const key = `${event.id}:${isSelected ? 1 : 0}:${isMuted ? 1 : 0}:${event.mapIcon || ''}:${event.order ?? ''}`;
  let icon = cache.get(key);
  if (icon) return icon;

  const emoji = getIcon(event.mapIcon);
  const artOrder = typeof event.order === 'number' && event.order >= 1 && event.order <= 50 ? event.order : null;
  const [pinW, pinH] = BIBLE_SPRITE_VARIANT.pin;
  const spriteAttr = artOrder != null ? getBibleEventSpriteStyleAttr(artOrder, pinW, pinH) : '';
  const orderHtml =
    event.order != null
      ? `<div class="event-map-pin__number" aria-hidden="true">${escapeAttr(String(event.order))}</div>`
      : '';

  const pinInner =
    artOrder != null
      ? `<div class="event-map-pin__sprite" style="${spriteAttr}" aria-hidden="true"></div>`
      : `<div class="event-map-pin__emoji" aria-hidden="true">${emoji}</div>`;

  const pinClass = ['event-map-pin', isSelected ? 'event-map-pin--selected' : '', isMuted ? 'event-map-pin--muted' : '']
    .filter(Boolean)
    .join(' ');

  icon = L.divIcon({
    className: 'event-map-pin-leaflet',
    html: `
      <div class="${pinClass}" role="button" tabindex="0" aria-label="${escapeAttr(event.title || 'Event')}">
        ${pinInner}
        ${orderHtml}
      </div>`,
    iconSize: [56, 56],
    iconAnchor: [28, 52],
    popupAnchor: [0, -48]
  });

  cache.set(key, icon);
  trimCache();
  return icon;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
