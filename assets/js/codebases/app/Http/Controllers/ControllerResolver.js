import { ProfileController } from 'codebaseDir/app/Http/Controllers/Unipos/ProfileController.js';
import { RouteMatchingController } from 'codebaseDir/app/Http/Controllers/Unipos/RouteMatchingController.js';
import UnipostRequestHandler from 'frameworkDir/Http/Requests/UnipostRequestHandler.js';

let unipostRequestHandler = new UnipostRequestHandler();
let profileController = new ProfileController({ unipostRequestHandler });
let routeMatchingController = new RouteMatchingController();

let controller = {
	routeMatchingController,
	profileController
};

export default controller;
