import { routeMap } from 'codebaseDir/routes/web.js';
import env from 'codebaseDir/env.js';

class RouteMatchingController
{
	constructor()
	{
		this.baseUrl = env.BASE_URL;
		this.apiUrl = env.API_URL;
		this.routes = routeMap;
		this.dispatch();
	}

	dispatch()
	{
		let currentRoute = window.location.href.replace(this.baseUrl, '').split("?")[0];
		let routeMatching = {};
		for (let key in this.routes) {
            if (currentRoute == key) {
				let route = this.routes[key].split("@");
				routeMatching = {
					'controller': route[0],
					'action': route[1]
				};
			}
        }

		return routeMatching;
	}
}

export { RouteMatchingController };
