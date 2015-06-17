import events from 'events';
import _ from "lodash";

import Dispatcher from '../dispatcher/AppDispatcher'
import Constants  from '../constants/Constants'
"use strict";

const CHANGE_EVENT = 'change';

var QueueStore = _.assign({}, events.EventEmitter.prototype, {

	_selected : [],
	_tracks : [],
	_position: null,

	emitChange () {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener (listener) {
		this.on(CHANGE_EVENT, listener);
	},

	setPosition (pos) {
		this._position = Number(pos);
	},

	getPosition (pos) {
		return this._position;
	},

	setTracks (tracks) {
		this._tracks = tracks || [];
	},

	getTracks () {
		return this._tracks;
	},

	getSelected () {
		return this._selected;
	},

	clearSelected () {
		this._selected = [];
	},

	addToSelection (track) {
		this._selected.push(track);
	},

	removeFromSelection (track) {
		let matches = _.filter(this._selected, _.matches(track));
		_.pull(this._selected, matches[0]);
	},
});

Dispatcher.register(action => {
	switch (action.actionType) {
		case Constants.QUEUE_SELECT:
			QueueStore.addToSelection(action.track);
			QueueStore.emitChange();
			break;

		case Constants.QUEUE_DESELECT:
			QueueStore.removeFromSelection(action.track);
			QueueStore.emitChange();
			break;

		case Constants.SONOS_SERVICE_POSITION_INFO_UPDATE:
			QueueStore.setPosition(action.info.Track);
			QueueStore.emitChange();
			break;

		case Constants.SONOS_SERVICE_QUEUE_UPDATE:
			QueueStore.setTracks(action.result.items);
			QueueStore.emitChange();
			break;

		case Constants.ZONE_GROUP_SELECT:
			QueueStore.setTracks(null);
			QueueStore.clearSelected();
			QueueStore.emitChange();
			break;

		case Constants.QUEUE_FLUSH:
			QueueStore.clearSelected();
			QueueStore.emitChange();
			break;
	}
});

export default QueueStore;

