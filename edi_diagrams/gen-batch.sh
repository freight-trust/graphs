#!/bin/bash 
set -e

FILES=*.json
for f in $FILES
do
  # extension="${f##*.}"
  # optional .extenstion reformat
  # filename="${f%.*}"
  echo "Generating $f UML Diagram..."
  `json-to-plantuml -f $f.json  | java -jar uml.jar -DPLANTUML_LIMIT_SIZE=45093 -Xmx1024m -v -pipe > $f.png`
  # uncomment this line to delete the source file.
  # rm $f
done

sleep 1

exit 0
