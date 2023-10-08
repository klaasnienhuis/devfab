// ./tailwind.config.js

module.exports = {
  content: [
    // ...
    // Add this line to include VitePress files in TWCSS
    "./docs/**/*.{md,html,js,vue}",
  ],
};
