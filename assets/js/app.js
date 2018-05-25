window.$ = window.jQuery = require('jquery');
window.axios = require('axios');

import css from 'sourceDir/css/app.css';
import env from 'codebaseDir/env.js';
import * as controllers from 'codebaseDir/app/Http/Controllers/ControllerResolver.js';

var MutationObserver = require('mutation-observer');

let currentUserId = undefined;
let isLoading = false;

let callback = async (mutationsList) => {
	let urlParams = window.location.href.replace(env.BASE_URL, '').split("?")[1];
	let newUserId = undefined;
	if (urlParams.indexOf('i=') != -1) {
		newUserId = urlParams.split("=")[1];
	}

	if (!isLoading) {
		if ((currentUserId == undefined && newUserId != undefined) || currentUserId != newUserId) {
			isLoading = true;

			let route = controllers.default.routeMatchingController.dispatch();
			if (!$.isEmptyObject(route)) {
				if ($('.wrapper').length) {
					await $('.wrapper').css("display", "none");
				}
				let action = route.action;
				let controller = route.controller.substring(route.controller.lastIndexOf('/') + 1);
				controller = controller.charAt(0).toLowerCase() + controller.slice(1);
				await controllers.default[controller][action]();
			}

			currentUserId = newUserId;
			isLoading = false;
		}
	}

};

let config = {
	childList: true,
	subtree: true
};

var observer = new MutationObserver(callback);

observer.observe(document.getElementById('js_body'), config);
