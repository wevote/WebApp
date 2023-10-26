# This suddenly become necessary with XCode 15 and iOS 17, on October 25, 2023
echo 'copying files and removing symlinks in WeVoteCordova/platforms/ios/www (new in Oct 2023)'
cd ../WeVoteCordova/platforms/ios/www || exit
rm bundle.js
cp ../../../../WebApp/build/bundle.js .
rm bundle.js.map
cp  ../../../../WebApp/build/bundle.js.map .
rm css
cp -r ../../../../WebApp/build/css .
rm img
cp -r ../../../../WebApp/build/img .
rm index.html
cp ../../../www/index.html .

