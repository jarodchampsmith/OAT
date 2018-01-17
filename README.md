# OATS

> An Intoria project.

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ quasar dev ios

# build for production with minification
$ quasar build ios

# lint code
$ quasar lint
```

##Production Build

###Important

Before you make a build, double check that the *'state.api.env'* are correctly set in index.js. 
These determine which API endpoint will be used and which seed database will be loaded for the application.

Build the application for production to generate the /dist files

``` bash
$ quasar build ios
```

Copy the files from /dist into /cordova/www

``` bash
$ cp -r /dist cordova/www
```

Zip the entire cordova folder to cordova.zip

Login to https://build.phonegap.com

Update the code on PhoneGap build by uploading the new cordova.zip file. The new application will automatically be built within a few minutes. 

Download the .ipa file from PhoneGap Build. 

Go to http://diawi.com and upload the new .ipa file (uncheck both checkboxes when uploading). A new link will be generated on Diawi which can be used to download the application on your iPad for testing. 