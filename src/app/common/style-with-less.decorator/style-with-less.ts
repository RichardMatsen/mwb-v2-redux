// Ref: http://myrighttocode.org/blog/typescript/angular2/decorators/angular2-custom-decorators

'use strict';
export function StyleWithLess(lessStyles) {

  const __ref__ = window['Reflect'],
    flatStyles = parseLessStyles('', lessStyles);

  return function (target) {
    const metaInformation = __ref__.getOwnMetadata('annotations', target);
    if (metaInformation) {
      parseMeta(metaInformation);
    }
  };

  // Parse metadata logic
  function parseMeta(metaInformation) {
    const metaInformation_1 = metaInformation;
    for (let _i = 0; _i < metaInformation_1.length; _i++) {
      const metadata = metaInformation_1[_i];
      metadata.styles = [flatStyles];
    }
  }

  function parseLessStyles(prefix, def) {
    const queue = [];
    let result = (prefix && prefix !== '') ? prefix + ' { ' : '';
    for (const key in def) {
      if (typeof def[key] === 'object') {
        queue.push({ key: key, value: def[key] });
      } else {
        result += toDashCase(key) + ':' + def[key] + ';';
      }
    }
    result += (prefix && prefix !== '') ? '}' : '';
    if (queue && queue.length > 0) {
      const queue_1 = queue;
      for (let _i = 0; _i < queue_1.length; _i++) {
        const sub = queue_1[_i];
        result += parseLessStyles(prefix + (sub.key[0] === '&' ? sub.key.substr(1) : ' ' + sub.key), sub.value);
      }
    }
    return result;
  }

  function toDashCase(str) {
    return str.replace(/([A-Z])/g, function ($1) {
      return '-' + $1.toLowerCase();
    });
  }

}
// # sourceMappingURL=StyleWithLess.js.map
