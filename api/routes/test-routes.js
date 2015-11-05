var app = require('../api');
var Pub  = require('../models').Pub;


app.get('/getEcho', function(req, res){
	res.status(201).json(req.query);
});
app.post('/postEcho', function(req, res){
	res.status(201).json(req.body);
});

app.get('/sampleProjects', function(req, res){
	// console.log(req.query);
	Pub.find({}, {'displayTitle': 1, 'uniqueTitle': 1})
	.limit(5)
	.exec(function(err, pubs){
		// console.log('yea were here');
		res.status(201).json(pubs);
	});

});


app.post('/loadProjects', function(req,res){
	// Want to load each project's title, authors, publishdate, abstract, image
	// console.log(req.body);
	Pub.find({'uniqueTitle': {$in: req.body}}, { '_id': 0, 'collaboratorsUsers': 1, 'image':1, 'displayTitle':1, 'uniqueTitle':1, 'versions':1})
		.populate({ path: 'collaboratorsUsers.authors', select: 'username name image'})
		.populate({ path: "versions", select: 'abstract'})
		.lean()
		.exec(function (err, pubs) {
			pubs.forEach(function(pub){
				pub['abstract'] = pub.versions[pub.versions.length-1].abstract;
				delete pub.versions;
			});
			
			res.status(201).json(pubs);
		});
	

});

app.post('/loadProject', function(req,res){
	console.log('in Load project backend')
	Pub.findOne({'uniqueTitle': req.body[0]}, { '_id': 0, 'versions': 1, 'collaboratorsUsers': 1, 'image':1, 'displayTitle':1, 'uniqueTitle':1})
		.populate({ path: "versions", select: 'abstract content postDate assetTree'})
		.populate({ path: 'collaboratorsUsers.authors', select: 'username name image'})
		.lean()
		.exec(function (err, pub) {

			var output = {
				displayTitle: pub.displayTitle,
				uniqueTitle: pub.uniqueTitle,
				image: pub.image,
				abstract: pub.versions[pub.versions.length-1].abstract,
				content: pub.versions[pub.versions.length-1].content,
				postDate: pub.versions[pub.versions.length-1].postDate,
				authors: pub.collaboratorsUsers.authors,
			}

			if(pub.versions[pub.versions.length-1].assetTree != undefined){
				var assetTree = JSON.parse(pub.versions[pub.versions.length-1].assetTree);
				output.content = output.content.replace(/\^\^asset{(.*?)}/g, function(match, capture) {
					return '!['+capture+']('+assetTree[capture]+')';
				});
			}
			output.content = output.content.replace(/\^\^(.*?){(.*?)}/g, '');  
			output.content = output.content.replace(/\^\^pagebreak/g, '');  
			output.content = output.content.replace(/(#+)/g, function(match, capture) {
					return match+' ';
				});
			
			
			res.status(201).json(output);
		});

});


app.get('/getSamplePub', function(req,res){
	// console.log(req.user);
	// console.log(req.query);
	let outputPub = {
		title: 'My Sample Pub',
		slug: 'cat',
		collaborators: [],
		discussions: [],
		highlights: [],
		favorited: [],
		assets: [],
		image: 'http://i.imgur.com/BvS0qUz.jpg',
		settings: {
			isPrivate: false
		},
		style: {},
		createDate: 1446744004219,
		lastUpdateDate: 1446744004319,
		featuredIn: [],
		submittedTo: [],
		endorsements: [],
		experts: [],
		invitedExperts: [],
		authorsNote: 'Hey everybody. This is just a draft!',
		markdown: "# Your New Pubs!\nWelcome to your new pub. Click the 'Edit Draft' button in the top-right corner to edit this content! The following text provides you with some starter content to see how Pubs are written. LaTeX and WSYWIG support coming soon!\n\n#Styling\n\n# Header1\n## Header2\n### Header3\n\nYou can add super cool links like this [Super Sweet Link](http://www.google.com/search?q=smiling+puppy&tbm=isch) \n\nAdd emphasis something _super_ important.\n\n#References\nAdd References to the right and cite them using the Cite Tag! ^^cite{refNameGoesHere}\n\n#Lists go like this\n\n* My\n* List\n* Items\n\n-- or like this --\n\n1. My \n2. List\n3. Items\n\n\n\n\n#Insert page Breaks:\n^^pagebreak\n\n#Images\n##We can do in-column and full-width images\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin libero et ante vestibulum euismod. Curabitur consequat arcu eu lacus condimentum laoreet. Etiam a ligula ac orci dictum fermentum vel in ligula. Vivamus gravida tempus leo, vitae tempus lectus vehicula et. Donec accumsan massa at elit tristique, quis aliquam nibh efficitur. Integer purus urna, luctus sed sagittis nec, ultrices semper lorem. Sed in porttitor eros.\n\n ![Some Steamboat Guy](http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg) \n\nMauris ut sollicitudin risus. In hac habitasse platea dictumst. Pellentesque eget velit eu elit egestas fermentum vitae eget urna. Duis dictum lacinia mauris in interdum. Aliquam porttitor ultricies diam eu pharetra. Vestibulum ornare tellus in facilisis venenatis. In sed ligula id purus pellentesque suscipit ut eu neque. Nam efficitur ultricies lacus laoreet porttitor. Phasellus rutrum bibendum sem, at laoreet nunc congue at. Cras efficitur urna eu orci lobortis tincidunt. Etiam pellentesque efficitur neque, ut finibus quam interdum sed.\n\n ![Smooth](http://i.imgur.com/7FJzLNd.gif) \nProin porttitor, quam ac sagittis aliquam, purus turpis sodales sapien, sed luctus lorem diam a magna. Vivamus ornare rutrum risus, et malesuada odio viverra ac. Phasellus volutpat eget nulla gravida accumsan. Praesent ac interdum purus. Donec arcu metus, placerat at turpis tempus, mattis lobortis velit. Proin tristique odio vel nibh gravida eleifend a eu risus. Donec sit amet lectus nibh. Vivamus blandit ultricies tempus. Sed tincidunt quis lectus placerat vestibulum. Aenean eget tortor aliquet, elementum ligula quis, congue leo. Nam ultricies, mi eget egestas efficitur, sapien enim tempus metus, sit amet iaculis dolor tortor non ipsum. Praesent ipsum nisl, fermentum sit amet bibendum id, fringilla at justo.\n\n\n<div class=\"full-width\"> <img src=\"http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg\" alt-text=\"Some Steamboat Guy Again\"/> <\/div>\n\n^^pagebreak\n\n#Inline Visualizations\nYou can embed your own visualizations! At PUBPUB's current state you must host the project yourself and embed an iframe. Come to us if you need help with that (pubpub@media.mit.edu). We'll be making that process smoother in the coming weeks.",
		html: '',
		abstract: 'Here is my abstract'
	};



	res.status(201).json(outputPub);
});





