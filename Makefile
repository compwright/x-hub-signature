.DEFAULT_GOAL := build

lint:
	./node_modules/.bin/standard --env jest --fix src

test: lint
	NODE_OPTIONS=--experimental-vm-modules ./node_modules/.bin/jest

test-watch:
	NODE_OPTIONS=--experimental-vm-modules ./node_modules/.bin/jest --watchAll

clean:
	rm -Rf ./dist

build: clean test
	./node_modules/.bin/unbuild

release:
	./node_modules/.bin/standard-version
