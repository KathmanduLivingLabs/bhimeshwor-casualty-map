#!/bin/bash
git pull origin gh-pages
cd ../data
node ../server/fetcher-archiver.js
topojson -o districts_topo.json --id-property 'ward_num, ward_num' --external-properties=data.csv --properties='district=ward' --properties='dead=dead' --properties='injured=injured' --properties='GovComplete=GovComplete' --properties='GovPartial=GovPartial' --properties='OthComplete=OthComplete' --properties='OthPartial=OthPartial' --properties='population=population' --properties='deadpercent=deadpercent' --properties='injuredpercent=injuredpercent' -- admindiv.geojson;
cd ..
git add -A
git commit -a -m "Updating data"
git push origin gh-pages
