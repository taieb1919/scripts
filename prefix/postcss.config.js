module.exports = {
  plugins: [
    require("postcss-prefix-selector")({
      prefix: ".tibou-analytix-notification-box",
      transform: function (prefix, selector) {
        // Avoid prefixing keyframes
        if (selector.startsWith("@")) return selector;
        return prefix + " " + selector;
      },
    }),
  ],
};
