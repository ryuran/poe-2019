module.exports = {
  extends: '@cleverage',
  rules:{
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': true,
        'optionalDependencies': true,
        'peerDependencies': true,
      },
    ],
  },
};
