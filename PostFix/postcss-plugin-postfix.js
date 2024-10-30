const {postfix} = require('./config'); // Import postfix from config


module.exports = (opts = {}) => {
    return {
        postcssPlugin: 'postcss-plugin-postfix',
        Once(root) {
            root.walkRules((rule) => {
                rule.selectors = rule.selectors.map(selector => {
                    // Match only standalone class selectors (e.g., .button, .button-decor) without nested elements
                    return selector.replace(/(^|\s|,)\.([\w-]+)(?![-_\w])/g, `$1.$2${postfix}`);
                });
            });
        }
    };
};

module.exports.postcss = true;
