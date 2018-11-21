import _values from 'lodash-es/values';

export { wikipedia as dataWikipedia } from 'wmf-sitematrix';
export { default as dataSuggestions } from 'name-suggestion-index/name-suggestions.json';

export { dataAddressFormats } from './address-formats.json';
export { dataDeprecated } from './deprecated.json';
export { dataDiscarded } from './discarded.json';
export { dataLocales } from './locales.json';
export { dataPhoneFormats } from './phone-formats.json';
export { dataShortcuts } from './shortcuts.json';

export { default as dataImperial } from './imperial.json';
export { default as dataDriveLeft } from './drive-left.json';
export { en as dataEn } from '../dist/locales/en.json';

import {
    features as ociFeatures,
    resources as ociResources
} from 'osm-community-index';

import { dataImagery } from './imagery.json';
import { presets } from './presets/presets.json';
import { defaults } from './presets/defaults.json';
import { categories } from './presets/categories.json';
import { fields } from './presets/fields.json';

import { geoArea as d3_geoArea } from 'd3-geo';
import whichPolygon from 'which-polygon';


// index the osm-community-index
var ociFeatureCollection = _values(ociFeatures).map(function(feature) {
    // workaround for which-polygon: only supports `properties`, not `id`
    // https://github.com/mapbox/which-polygon/pull/6
    feature.properties = {
        id: feature.id,
        area: d3_geoArea(feature)   // also precompute areas
    };
    return feature;
});

export function getData() {
    if (typeof ID_CONFIG === 'undefined') ID_CONFIG = {}
    return {
        community: {
            features: ociFeatures,
            resources: ociResources,
            query: whichPolygon({
                type: 'FeatureCollection',
                features: ociFeatureCollection
            })
        },
        imagery: ID_CONFIG.imagery || dataImagery,  //legacy
        presets: {
            presets: ID_CONFIG.presets || presets,
            defaults: ID_CONFIG.defaults || defaults,
            categories: ID_CONFIG.categories || categories,
            fields: ID_CONFIG.fields || fields
        }
    };
}
