version_num := $(shell node -p "require('./package.json').version")

help: ## Display help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

set: ## Set new version "$ make set v=X.X.X"
	@npm --new-version=$$v run-script set_version

version: ## View current version
	@echo "Anonacy App v$(version_num)"

v: ## View current version
	@make version

tag: ## tag current version and push to repo
	@git tag ${version_num} && git push origin ${version_num}

all: ## push, tag, and deploy
	@git push && make tag && make deploy

deploy: ## firebase deploy webapp
	@rm -rf www/ && \
		ionic build --prod && \
		firebase deploy --only hosting:hewham-ionic

function: ## deploy firebase functions
	firebase deploy --only functions

icons: ## generate ios and android resources
	@npx cordova-res ios --skip-config --copy && \
		npx cordova-res android --skip-config --copy

# up_ext_v: ## upload version to server and post to slack
# 	@curl -X PUT --data "extensionVersion=$(version_num)" https://api.anonacy.com/v1/metadata && \
# 		echo "\n \n Webapp Version Uploaded! v$(version_num) \n"
