export function s3Upload(file, folderName, progressEvent, finishEvent, index) {
	function beginUpload() {
		const filename = file.name !== undefined ? folderName + '/' + new Date().getTime() + '_' + file.name.replace(/ /g, '') : folderName + '/' + new Date().getTime() + '.jpg';
		const fileType = file.type !== undefined ? file.type : 'image/jpeg';
		const formData = new FormData();

		formData.append('key', filename);
		formData.append('AWSAccessKeyId', 'AKIAJUWJHTNGRRTA2GTQ');
		formData.append('acl', 'public-read');
		formData.append('policy', JSON.parse(this.responseText).policy);
		formData.append('signature', JSON.parse(this.responseText).signature);
		formData.append('Content-Type', fileType);
		formData.append('success_action_status', '200');
		formData.append('file', file);

		const sendFile = new XMLHttpRequest();
		sendFile.upload.addEventListener('progress', (evt)=>{
			progressEvent(evt, index);
		}, false);
		const extension = file.name.split(".")[file.name.split(".").length - 1];
		switch (extension){

			case "stl":
				sendFile.upload.addEventListener('load', (evt)=>{
					finishEvent(evt, index, extension, filename, file.name);
					}, false);
				break;
			default:
				sendFile.upload.addEventListener('load', (evt)=>{
					finishEvent(evt, index, file.type, filename, file.name);
				}, false);
		}
		sendFile.open('POST', 'http://pubpub-upload.s3.amazonaws.com/', true);
		sendFile.send(formData);
	}

	const getPolicy = new XMLHttpRequest();
	getPolicy.addEventListener('load', beginUpload);
	getPolicy.open('GET', '/api/uploadPolicy?contentType=' + file.type);
	getPolicy.send();
}
