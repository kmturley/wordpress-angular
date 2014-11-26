    <script src="<?php echo get_template_directory_uri() ?>/libs/angular/angular.min.js"></script>
    <script src="<?php echo get_template_directory_uri() ?>/libs/angular/angular-resource.min.js"></script>
    <script src="<?php echo get_template_directory_uri() ?>/libs/angular-ui/angular-ui-bootstrap.min.js"></script>
    <script src="<?php echo get_template_directory_uri() ?>/libs/angular-ui/angular-ui-router.min.js"></script>
    <script src="<?php echo get_template_directory_uri() ?>/modules/app/app.js"></script>
    <script src="<?php echo get_template_directory_uri() ?>/modules/page/page.js"></script>
    <script>
        var settings = {
            "stateProvider": false,
            "theme": "<?php echo get_template_directory_uri() ?>"
        };
    </script>
    <?php wp_footer(); ?>
</body>
</html>