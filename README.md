wordpress-angular
===========
Wordpress and AngularJS combined:

    Wordpress `http://wordpress.org/`
    Wordpress REST api plugin `https://wordpress.org/plugins/json-rest-api/`
    AngularJS `http://angularjs.org/`
    
## Installation and running tasks

Install [Wordpress](http://wordpress.org/) then navigate to the admin at:

    http://localhost:8888/wp-admin/

Go to the plugins section and install the REST api plugin called JSON REST API (WP API)
    
After installing the plugin, put this wordpress-angular theme inside the following folder, and activate the theme in the admin

    /wp-content/themes/wordpress-angular

## Running the app during development

Go to the folder and open the first page in your web browser

    http://localhost:8888/

## Directory Layout

    footer.php        --> footer and javascript includes
    functions.php     --> wordpress override functions
    header.php        --> header and css includes
    index.php         --> index page (the main html template of the app)
    libs/             --> external libraries and fonts
    modules/          --> modules grouped by functionality
        app/          --> main application module
        page/         --> view/edit item
    style.css         --> Wordpress stylesheet

## Contact

For more information on AngularJS please check out `http://angularjs.org/`