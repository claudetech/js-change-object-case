all: change-object-case.min.js

change-object-case.js:
	mkdir -p dist
	browserify -s changeCase -o dist/change-object-case.js .

change-object-case.min.js: change-object-case.js
	uglifyjs dist/change-object-case.js > dist/change-object-case.min.js

test:
	istanbul cover node_modules/.bin/_mocha

ci:
	./node_modules/.bin/mocha -w

coveralls:
	istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: test
