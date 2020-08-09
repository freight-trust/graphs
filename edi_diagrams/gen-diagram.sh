#!/bin/bash 
# JDK 8 or 11 
set -e

sleep 1
JAVA_HOME=/usr/lib/jvm/zulu-8-amd64 
# LIMIT SIZE ++ MEMEORY , ITS A HUUUUUGE DIAGRAM
echo ""
export PLANTUML_LIMIT_SIZE=45093
json-to-plantuml -f *.json  | java -jar uml.jar -DPLANTUML_LIMIT_SIZE=45093 -Xmx1024m -v -pipe > 
