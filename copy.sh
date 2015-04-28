
mkdir y-richtext
mkdir y-webrtc
mkdir y-selections
mkdir y-list
mkdir yjs
mkdir quill

cp ../y-richtext/build -rf y-richtext
cp ../y-richtext/lib -rf y-richtext
cp ../y-webrtc/build -rf y-webrtc
cp ../y-webrtc/lib -rf y-webrtc
cp ../y-selections/build -rf y-selections
cp ../y-selections/lib -rf y-selections
cp ../y-list/build -rf y-list
cp ../y-list/lib -rf y-list
cp ../yjs/build -rf yjs
cp ../yjs/lib -rf yjs

cp ../quill/dist -rf quill

cp ../y-richtext/examples/quilljs/* . 

sed -i 's/\.\.\/\.\.\/\.\.\//\.\//g' index.html

git add -A
