module.exports = {
    trailingComma: 'none',
    bracketSameLine: true,
    overrides: [
      {
        files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
        options: {
          singleQuote: true,
          jsxSingleQuote: true
        }
      },
      {
        files: ['*.html'],
        options: {
          htmlWhitespaceSensitivity: 'ignore',
          singleAttributePerLine: true
        }
      }
    ]
  };