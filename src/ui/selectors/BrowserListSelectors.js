import _ from 'lodash';
import getServiceLogoUrl from '../helpers/getServiceLogoUrl';

import {
    DEFAULT_SEARCH_MODE,
    LIBRARY_SEARCH_MODES
} from '../constants/BrowserListConstants';

export function getCurrentState(state) {
    return _.last(state.browserList.history);
}

export function getServiceItems(state) {
    return state.musicServices.active.map(ser => ({
        title: ser.service.Name,
        action: 'service',
        service: ser
    }));
}

export function getSearching(state) {
    return !!state.browserList.searchTerm;
}

export function getSearchMode(state) {
    return getCurrentState(state).mode || DEFAULT_SEARCH_MODE;
}

export function getAVailableSearchModes(state) {
    return getCurrentState(state).searchTermMap || LIBRARY_SEARCH_MODES;
}

export function getHistory(state) {
    return state.browserList.history;
}

export function getSearchSources(state) {
    return _.uniq(
        [
            {
                label: 'Music Library',
                client: null,
                logo: './svg/ic_audiotrack_48px.svg'
            }
        ].concat(
            _.map(state.musicServices.active, s => {
                return {
                    logo: getServiceLogoUrl(s.service.Id),
                    label: s.service.Name,
                    client: s
                };
            })
        )
    );
}
