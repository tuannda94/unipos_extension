import { ProfileController } from 'codebaseDir/app/Http/Controllers/Unipos/ProfileController.js';
import { RouteMatchingController } from 'codebaseDir/app/Http/Controllers/Unipos/RouteMatchingController.js';
import UnipostRequestHandler from 'frameworkDir/Http/Requests/UnipostRequestHandler.js';
import { unipos } from 'codebaseDir/config/unipos.js';

let unipostRequestHandler = new UnipostRequestHandler({
    maxRequestResult: unipos.max_request_result,
});
let profileController = new ProfileController({ unipostRequestHandler });
let routeMatchingController = new RouteMatchingController();

let controller = {
    routeMatchingController,
    profileController
};

export default controller;
