# Minify CSS Action Block

## Example Usage

	curl -v -X OPTIONS http://block-minify-css.herokuapp.com
	
	curl -i -X POST -d '{"inputs":[{"css":".foo { font-weight:bold; }"}]}' -H "Content-Type: application/json" http://block-minify-css.herokuapp.com