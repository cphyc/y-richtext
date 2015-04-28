
gulp.task('copyfonts', function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('./fonts'));
});


libs = ['y-richtext', 'y-list', 'y-selections', 'yjs']
dirs = ['build', 'lib']

all_files = []
for lib in libs
  for dir in dirs
    all_files.push lib+'/'+dir+'/**'

gulp.task 'copylibs', ()->
  gulp.src 
