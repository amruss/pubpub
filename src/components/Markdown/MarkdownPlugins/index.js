import ImagePlugin from './imagePlugin';
import QuotePlugin from './quotePlugin';
import VideoPlugin from './videoPlugin';
import CitePlugin from './citePlugin';
import IframePlugin from './iframePlugin';
import SelectionPlugin from './selectionPlugin';
import FootnotePlugin from './footnotePlugin';
import PagebreakPlugin from './pagebreakPlugin';
import LinebreakPlugin from './linebreakPlugin';
import CursorPlugin from './cursorPlugin';
import STLPlugin from './stlFile';

// Page-only Plugins
import pubListPlugin from './pubListPlugin';
import collectionListPlugin from './collectionListPlugin';
import linkPlugin 	from './linkPlugin';
import searchPlugin 	from './searchPlugin';

export default {
	image: ImagePlugin,
	quote: QuotePlugin,
	video: VideoPlugin,
	cite: CitePlugin,
	cursor: CursorPlugin,
	iframe: IframePlugin,
	highlight: SelectionPlugin,
	footnote: FootnotePlugin,
	linebreak: LinebreakPlugin,
	pagebreak: PagebreakPlugin,
	pubList: pubListPlugin,
	collectionList: collectionListPlugin,
	link: linkPlugin,
	search: searchPlugin,
	stl: STLPlugin,
};
