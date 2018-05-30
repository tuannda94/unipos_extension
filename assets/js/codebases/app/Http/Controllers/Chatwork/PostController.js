let html = require('codebaseDir/views/cw/main.html');
import css from 'sourceDir/css/bootstrap-iso.css';

class PostController
{
	constructor()
	{
		this.eventBinding();
	}

	eventBinding()
	{
		$("#unipos-icon").on("click", (event) => {
			$(".modal").modal("show");
			$("#btn-send").on("click", (event) => {
				console.log('aa');
			});
		});
	}
}

export { PostController };
