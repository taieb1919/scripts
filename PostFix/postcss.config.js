module.exports = {
  plugins: [
    require('./postcss-plugin-postfix')({
      postfix: '-MyPostFix' // Replace this with your desired postfix
    })
  ]
};
