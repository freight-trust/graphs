#!/usr/bin/env sh
wget "https://github.com/freight-trust/bintray/releases/download/plantuml/plantuml.jar" -O plantuml.jar
sudo mkdir -p /opt/plantuml
sudo cp plantuml.jar /opt/plantuml
echo '#!/usr/bin/env sh' > plantuml.sh
echo 'exec java -jar /opt/plantuml/plantuml.jar "$@"' >> plantuml.sh
sudo install -m 755 plantuml.sh /usr/local/bin/plantuml
plantuml -version
