INTROSPECTION='{"query":"{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name locations args{...InputValue}}}}fragment FullType on __Type{kind name fields(includeDeprecated: true){name args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated: true){name isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}"}'

.PHONY: diff clean

diff: schema1.graphqls schema2.graphqls
	(diff -u $^ || true) | highlight -Oxterm256 --syntax diff

clean:
	rm -rf *.js node_modules schema{1,2}.{graphqls,json}

pp.js: pp.ts node_modules/.i
	npm run build

node_modules/.i: package.json
	npm ci
	touch node_modules/.i

%.graphqls: pp.js %.json
	node $^ > $@

schema1.json:
	curl -s --data $(INTROSPECTION) \
		-H 'Content-Type: application/json' \
		-H 'FEDERATED: 0' \
		https://engine-graphql.apollographql.com/api/graphql \
		> $@

schema2.json:
	curl -s --data $(INTROSPECTION) \
		-H 'Content-Type: application/json' \
		-H 'FEDERATED: 1' \
		https://engine-graphql.apollographql.com/api/graphql \
		> $@
