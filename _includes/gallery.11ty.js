exports.data = {
	layout : "outerGallery.njk"
};
const Image = require("@11ty/eleventy-img");
function resizeImage( file ) {

	// generate a new jpeg image with 300px width and copy it and the og image to the /img/ folder
	Image( file, {
		widths: [ 300 , null ],
		formats: [ "jpeg" ],
		urlPath: "/img/",
		outputDir: "./_site/img/"
	});
	// get the metadata of the image even if the image generation is not finished yet
	let metadata = Image.statsSync( file, {
		widths: [ 300 , null ],
		formats: [ "jpeg" ],
		urlPath: "/img/",
		outputDir: "./_site/img/"
	});

	return {
	thumbnailUrl : metadata.jpeg[0].url,
	OGUrl : metadata.jpeg[1].url, // <---- metadata.jpeg[1] returns undefined ?!?!
	heightRatio : metadata.jpeg[0].height / metadata.jpeg[0].width * 100, // height is ??? percent of the width
	widthRatio : metadata.jpeg[0].height / metadata.jpeg[0].width * 100 // width is ??? percent of the height
	}
}
exports.render = function(data) {

	let columns = [];
	for (i=0; i < data.number_of_columns; i++){
		columns.push( { size : 0, imagesInColumn : []} );
	}

	// console.log( data.imageCollections[data.collection_id].info );
	for (i=0; i < data.imageCollections[data.collection_id].info.length; i++ ){

		let smallestColumn = 0;
		let smallestColumnSize = columns[0].size;

		for (ii=1; ii < columns.length; ii++){
			if (columns[ii].size < smallestColumnSize) {
				smallestColumnSize = columns[ii].size;
				smallestColumn = ii;
			};
		}

		columns[smallestColumn].imagesInColumn.push({
			...resizeImage( `./_data/imageCollections/${data.collection_id}/${data.imageCollections[data.collection_id].info[i].file}` ),
			...{ id : i, caption : data.imageCollections[data.collection_id].info[i].caption }
		})

		columns[smallestColumn].size += columns[smallestColumn].imagesInColumn[ (columns[smallestColumn].imagesInColumn.length -1) ].heightRatio;
	}

	let gallery = `<div class="gallery">
	`;
	for (i=0; i < columns.length; i++ ){
		gallery = gallery + `<div class="gallery__column">
		`;
		for (ii=0; ii < columns[i].imagesInColumn.length; ii++ ){
			gallery = gallery + `<div class="preview__widthBox">
				<div class="preview__widthBox_heightBox" style="padding-bottom:${columns[i].imagesInColumn[ii].heightRatio}%">
					<img class="preview__image" 
					id="${columns[i].imagesInColumn[ii].id}"
					src="${columns[i].imagesInColumn[ii].thumbnailUrl}"
					data-target-url="${columns[i].imagesInColumn[ii].OGUrl}"
					data-caption="${columns[i].imagesInColumn[ii].caption.replace('\n','<br>')}"
					alt="${columns[i].imagesInColumn[ii].caption}"
					loading="lazy">
				</div>
			</div>
			`;
		}
		gallery= gallery + `</div>
		`;
	}
	gallery = gallery + `</div`;

	return gallery;
	};