#!/bin/bash 
export PLANTUML_LIMIT_SIZE=24384 
json-to-plantuml -f X12_00503_850.json | java -jar uml.jar -DPLANTUML_LIMIT_SIZE=24384 -v -pipe > file.png
