echo "parameter 1" $1

export PATH=/QOpenSys/pkgs/lib/nodejs10/bin:$PATH;  
export LIBPATH=/QOpenSys/pkgs/lib/nodejs10/bin:$LIBPATH;
export NODE_PATH=/QOpenSys/pkgs/lib/nodejs10/node_modules:$NODE_PATH;
node -v;

node /Beesda2/NodeJS/Productie/ewsmail/js/handleApiMailEWS.js $1;
