import { ProfileController } from 'codebaseDir/app/Http/Controllers/Unipos/ProfileController.js';
import { RouteMatchingController } from 'codebaseDir/app/Http/Controllers/Unipos/RouteMatchingController.js';
// import Unipos Controllers

import { PostController } from 'codebaseDir/app/Http/Controllers/Chatwork/PostController.js';
// import Chatwork Controllers

// import configs & framework base classes
import UniposProfileRequestHandler from 'frameworkDir/Http/Requests/UniposProfileRequestHandler.js';
import { unipos } from 'codebaseDir/config/unipos.js';

let uniposProfileRequestHandler = new UniposProfileRequestHandler({
    maxRequestResult: unipos.max_request_result,
});
let profileController = new ProfileController({ uniposProfileRequestHandler });
let routeMatchingController = new RouteMatchingController();

let cwPostController = new PostController();

let controller = {
    routeMatchingController,
    profileController,
    cwPostController,
};

export default controller;
