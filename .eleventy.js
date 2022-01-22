const yaml = require("js-yaml");
const csv = require("papaparse");
const Image = require("@11ty/eleventy-img");

module.exports = (eleventyConfig) => {

	//pass through copy for css javascript and internal images
	eleventyConfig.addPassthroughCopy({ "_includes/assets": "assets" });
	eleventyConfig.addPassthroughCopy({ "favicon.ico": "favicon.ico" });
	eleventyConfig.addPassthroughCopy({ "favicon.png": "favicon.png" });
	eleventyConfig.addPassthroughCopy({ "_data/home": "img" });
	eleventyConfig.addPassthroughCopy({ "_data/pdf": "pdf" });
	eleventyConfig.addPassthroughCopy({ "_data/video": "video" });
	// eleventyConfig.addPassthroughCopy({ "img": "img" });

	
	eleventyConfig.addCollection("frenchPages", function(collectionApi) {
		let collection = collectionApi.getFilteredByTag("fr").sort( ( A , B ) => {
			if (A.data.chapter_number < B.data.chapter_number){return -1;}
			if (A.data.chapter_number > B.data.chapter_number){return +1;}
			return 0;
		});
		for (let i=0; i< collection.length; i++){
			console.log(collection[i].fileSlug)
		};
		return collection;
	});
	eleventyConfig.addCollection("englishPages", function(collectionApi) {
		let collection = collectionApi.getFilteredByTag("en").sort( ( A , B ) => {
			if (A.data.chapter_number < B.data.chapter_number){return -1;}
			if (A.data.chapter_number > B.data.chapter_number){return +1;}
			return 0;
		});
		for (let i=0; i< collection.length; i++){
			console.log(collection[i].fileSlug)
		};
		return collection;
	});

	eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
	eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
	eleventyConfig.addDataExtension(
		"csv",
		(contents) => {
			// console.log(contents);
			// console.log(typeof(contents)); //content is a string
			let csvData;
			csv.parse(
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
						// console.log( result.data ); // for debug purpose
						// return result.data;
						csvData = result.data;
					},
					error: ( error, file ) => { console.log(error) },
					download: false,
					skipEmptyLines: "greedy",
					fastMode: undefined, //Fast mode will automatically be enabled if no " characters appear in the input. 
				}
			);
			return csvData;
		}
	);
};