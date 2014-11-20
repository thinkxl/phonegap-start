var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
}

// # Globbing
// for performance reasons we're only matching one level down:
// 'path/to/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'path/to/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  // require('load-grunt-tasks')(grunt)
  require('jit-grunt')(grunt);

  // Configurable paths
  var config = {
    dev: '.',
    prod: '../www/'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Project settings
    config: config,

    watch: {
      options: {
        livereload: true
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: '<%= config.dev %>/sass/{,*/}*.scss',
        tasks: ['sass']
      },
      livereload: {
        livereload: true,
        files: [
          '<%= config.dev %>/{,*/}*.html',
          '<%= config.dev %>/js/{,*/}*.js',
          '<%= config.dev %>/css/{,*/}*.css',
        ]
      }
    },

    sass: {
      options: {
        trace: true
      },
      dev: {
        files: {
          '<%= config.dev %>/css/stlye.css': '<%= config.dev %>/sass/style.scss'
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, '')
            ];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    // Automatically inject Bower components into the HTML file
    bowerInstall: {
      dist: {
        src: ['<%= config.dev %>/index.html']
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= config.prod %>/js/{,*/}*.js',
            '<%= config.prod %>/css/{,*/}*.css',
            '<%= config.prod %>/img/{,*/}*.*',
            '<%= config.prod %>/*.{ico,png}',
          ]
        }
      }
    },

    // Reads html for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest:' <%= config.prod %>' 
      },
      html: '<%= config.dev %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration 
    usemin: {
      options: {
        assetsDirs: ['<%= config.prod %>', '<%= config.prod %>/img']
      },
      html: ['<%= config.prod %>/{,*/}*.html'],
      css: ['<%= config.prod %>/css/{,*/}*.css']
    },

    rsync: {
      options: {
        args: ['--verbose'],
        exclude: ['sass', '*~', '*.swp', '.*', '*.md', 'node_modules', 'bower_components', 'Gruntfile.js', 'package.json', 'bower.json'],
        recursive: true
      },
      dist: {
        options: {
          src: '<%= config.dev %>',
          dest: '<%= config.prod %>'
        }
      }
    }
  });

  // load plugins 
  // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  // default task(s)
  grunt.registerTask('default', function() {
    grunt.task.run([
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', function() {
    grunt.task.run([
      'useminPrepare',
      'concat',
      'cssmin',
      'uglify',
      'rsync',
      'rev',
      'usemin'
    ]);
  });
};
