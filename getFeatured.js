var cheerio = require('cheerio');
var request = require('request');
var url = require('url');
var tidy = require('htmltidy').tidy;
var Entities = require('html-entities').AllHtmlEntities;
var searchUrl = "http://www.shopgoodwill.com/";

exports.listFeatured = function(req, res){

	request(searchUrl, function(err, resp, body) {
		if(!err) {
			tidy(body, function(error, html){
				if(!error) {
					//Get featured items in list
					getFeatured(html);
				}
			});
		}
	});

	var getFeatured = function(html){
		var featuredItemsArray = [];
		$ = cheerio.load(html);
		var featuredItems = $('.homerightbox ul.dottedlist').children('li');

		entities = new Entities();

		featuredItems.each(function(i, el){
			var item = {};
			item.title = $(el).children('a').children('span').first().text().trim();
			console.log(item.title);
			item.title = item.title.replace(/(\r\n|\n|\r)/gm," ");
			item.title = item.title.replace(/(~)/gim,"");
			item.title = item.title.replace(/(�)/gim," ");
			console.log(item.title);
			item.url = $(el).children('a').attr('href');
			item.url = item.url.replace(/\/auctions\//gi,'').trim();
			console.log(item.url);
			item.id = item.url.replace(/.*-([0-9]*)?\.html/gim,'$1');
			featuredItemsArray.push(item);
		});

		res.jsonp(featuredItemsArray);
	};

	var cleanItem = function(itemName) {
		var tCat = itemName.toLowerCase();
		tCat = tCat.replace(/&amp;/g,'');
		tCat = tCat.replace(/&gt;/g,'');
		tCat = tCat.replace(/&/g,'');
		tCat = tCat.replace(/\//g,'');
		tCat = tCat.replace(/ /g,'');
		return tCat;
	}

};