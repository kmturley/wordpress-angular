<?php get_header(); ?>
<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" ng-click="navbarCollapsed = !navbarCollapsed">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" ui-sref="posts">Wordpress Angular</a>
        </div>
        <div class="collapse navbar-collapse" collapse="navbarCollapsed">
            <ul class="nav navbar-nav">
                <li ng-repeat="item in pages"><a ui-sref="page({slug:item.slug})">{{ item.title }}</a></li>
            </ul>
        </div>
    </div>
</div>
<div class="container" ui-view="main">
</div>
<?php get_footer(); ?>