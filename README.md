# React-Gulp-Browserify

A sample app to learn about building React apps with gulp and browserify

## Getting started

        git clone <repo>
        npm install

## Running the app

The gulp file will compile the styles (SASS), convert the React and ES2015 features to standard Javascript and bundle the code, and copy all the necessary files to a `dev_build/` directory, and launch Browser-Sync.

        gulp serve
      
        # or just plain
      
        gulp

To just build the app without watching the files,

        gulp build

If you suspect that a file is not updating, you can start from a fresh build directory by running,

        gulp clean

## Roadmap

TODO: add testing

TODO: add code that actually does something
