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

import {
    utilStringQs
} from '../modules/util';
import { request as d3_request } from 'd3-request';

import Q from 'q';

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


// load custom config
var query = utilStringQs(window.location.hash.substring(1));

function getCustomConfig (param) {
    
    if (query.hasOwnProperty(param)) {
        var deferred = Q.defer();
        console.log('CUSTOM CONFIG: ' + param + ' - ' + query[param]);
        d3_request(query[param])
        .mimeType('application/json')
        .response(function(xhr) { return JSON.parse(xhr.responseText); })
        .get(function(err, data) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            } else {
                if (param === 'imagery_config') {
                    if (data.dataImagery && Array.isArray(data.dataImagery)) {
                        deferred.resolve(data.dataImagery);
                    } else {
                        deferred.reject(new Error('Invalid Custom Imagery Config'));
                    }
                } else if (param === 'presets_config') {
                    if (data.presets) {

                        var customPresets = {
                            presets: data.presets,
                            defaults: data.default || defaults,
                            categories: data.categories || categories,
                            fields: data.fields || fields
                        }
                        deferred.resolve(customPresets);
                    } else {
                        deferred.reject(new Error('Invalid Custom Preset Config'));
                    }
                }
            }
        });
        return deferred.promise;
    }
}

var presetsLocal = {
    presets: presets,
    defaults: defaults,
    categories: categories,
    fields: fields
};

export var data = {
    community: {
        features: ociFeatures,
        resources: ociResources,
        query: whichPolygon({
            type: 'FeatureCollection',
            features: ociFeatureCollection
        })
    },
    imagery: query.hasOwnProperty('imagery_config') ? getCustomConfig('imagery_config') : dataImagery,  //legacy
    presets: query.hasOwnProperty('presets_config') ? getCustomConfig('presets_config') : presetsLocal
};
