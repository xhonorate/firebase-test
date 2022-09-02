# use only on GTLF files INSIDE OF public folder
if ["$1" == ""]; then {
  echo "MISSING INPUT FOLDER LOCATION PARAM!"
  exit;
}
fi

if ["$2" == ""]; then {
  echo "MISSING OUTPUT FOLDER NAME PARAM!"
  exit;
}
fi

echo "Importing from: $1"; # pass folder as param
echo "Exporting to: $2"; # output folder name

mkdir components/main/three/gltfjsx/$2;

for f in $1/*; do 
  echo "Processing $f file...";

  FILENAME=`(echo "$f" | grep -p -o '/\(\w\|\d\)*\.' | grep -p -o '\(\w\|\d\)*' )`;

  NEWFILE="components/main/three/gltfjsx/$2/$FILENAME.tsx"
  CLASSNAME=$(echo $FILENAME | perl -pe 's/(^|_)./uc($&)/ge;s/_//g');

  ASSETLOCATION=`(echo "$1" | grep -p -o 'assets\/\(.*\)' )`

  npx gltfjsx $f -k -t -I; #TODO: add --shadows
  if test -f "$FILENAME.tsx"; then {
    mv -f "$FILENAME.tsx" "Gltf.tsx"
  }
  fi
  sed -e "s/as GLTFResult/as unknown as GLTFResult/g" -e "s/Model/$CLASSNAME/g" -e "s#$FILENAME\.gltf#$ASSETLOCATION\/$FILENAME\.gltf#g" Gltf.tsx > $NEWFILE;
  done;

  rm Gltf.tsx
  echo "...DONE!";