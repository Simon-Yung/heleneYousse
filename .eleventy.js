const yaml = require("js-yaml");
const csv = require("papaparse");
const Image = require("@11ty/eleventy-img");

module.exports = (eleventyConfig) => {

	//pass through copy for css javascript and internal images
	eleventyConfig.addPassthroughCopy({ "_includes/assets": "assets" });
	eleventyConfig.addPassthroughCopy({ "favicon.ico": "favicon.ico" });
	eleventyConfig.addPassthroughCopy({ "favicon.png": "favicon.png" });
	// eleventyConfig.addPassthroughCopy({ "img": "img" });

	eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
	eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
	eleventyConfig.addDataExtension(
		"csv",
		(contents) => {
			// console.log(contents);
			// console.log(typeof(contents)); //content is a string
			return csv.parse( 
				contents ,
				{
					// see https://www.papaparse.com/docs#config for detailed config options
					delimiter: ",",
					newline: "",// auto-detect
					quoteChar: '"',
					escapeChar: '\\',
					header: true,
					encoding: "UTF-8",
					complete: ( result, file ) => {
						if (result.errors){
							for ( let i=0 ; i < result.errors.length ; i++ )
							console.log(result.errors[i])
						}
						console.log( result.data ); // for debug purpose
						return result.data;
					},
					error: ( error, file ) => { console.log(error) },
					download: false,
					skipEmptyLines: "greedy",
					fastMode: undefined, //Fast mode will automatically be enabled if no " characters appear in the input. 
				}
			);
		}
	);


	async function imageShortcode( src , id ) {
	
		// generate a new jpeg image with 400px width and copy the og image to the /img/ folder
		Image( `.${src}`, {
			widths: [ 300 , null ],
			formats: [ "jpeg" ],
			urlPath: "/img/",
			outputDir: "./img/"
		});
		// get the metadata of the image even if the image generation is not finished yet
		let metadata = Image.statsSync( `.${src}`, {
			widths: [ 300 , null ],
			formats: [ "jpeg" ],
			urlPath: "/img/",
			outputDir: "./img/"
		});
	
		let thumbnailUrl = metadata.jpeg[0].url;
		let sourceUrl = metadata.jpeg[metadata.jpeg.length - 1].url; // <---- metadata.jpeg[1] returns undefined ?!?!
	
		let widthRatio = 100 / metadata.jpeg[0].height * metadata.jpeg[0].width; // width lenght is ??? per-tenth of the height
		let heightRatio = 100 / metadata.jpeg[0].width * metadata.jpeg[0].height; // height lenght is ??? percent of the width
	
		return `
		<div class="thumbnail" style="flex-grow:${widthRatio/10};flex-shrink:${widthRatio/10};flex-basis:${widthRatio/10}px;width:${widthRatio/10}px;">\n
			<div class="thumbnail_ratio" style="padding-bottom:${heightRatio}%;">\n
				<img class="thumbnail_image" id="${id}" onclick="openModal(${id})" loading="lazy" src="${websiteUrl}${thumbnailUrl}" data-source="${websiteUrl}${sourceUrl}">\n
			</div>\n
		</div>\n`;
	}
	eleventyConfig.addShortcode( "image", imageShortcode );
};