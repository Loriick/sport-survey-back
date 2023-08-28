#!/bin/bash

cd ..
zip -r foot-poll-api-new.zip . -x "node_modules/*" -x "dist/*" -x ".env" -x "k8s/*"