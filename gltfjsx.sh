for f in public/assets/kaykit/Models/objects/gltf/*; do 
  echo "Processing $f file...";
  FILENAME=$(echo $f | sed -e "s/public\/assets\/kaykit\/Models\/objects\/gltf\///g" -e "s/.gltf.glb//g");
  NEWFILE=$(echo $f | sed -e "s/public\/assets\/kaykit\/Models\/objects\/gltf/components\/main\/three\/gltfjsx\/objects/g" -e "s/.gltf.glb/.tsx/g");

  CLASSNAME=$(echo $FILENAME | perl -pe 's/(^|_)./uc($&)/ge;s/_//g');

  npx gltfjsx $f -t -I;
  sed -e "s/as GLTFResult/as unknown as GLTFResult/g" -e "s/Model/$CLASSNAME/g" -e "s/\/$FILENAME/\/assets\/kaykit\/Models\/objects\/gltf\/$FILENAME/g" Gltf.tsx > $NEWFILE;
  done;

  rm Gltf.tsx;
  echo "...DONE!";