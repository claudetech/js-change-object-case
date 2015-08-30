all: change-object-case.min.js

change-object-case.js:
	mkdir -p dist
	browserify -s changeCase -o dist/change-object-case.js .

change-object-case.min.js: change-object-case.js
	uglifyjs dist/change-object-case.js > dist/change-object-case.min.js

test:
	istanbul cover node_modules/.bin/_mocha

.PHONY: test
