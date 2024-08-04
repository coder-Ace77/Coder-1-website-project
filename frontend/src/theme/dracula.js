const draculaTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { background: '282a36' },
      { token: 'comment', foreground: '6272a4' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'variable', foreground: '50fa7b' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'constant', foreground: 'ffb86c' },
      { token: 'type', foreground: '8be9fd' },
      { token: 'function', foreground: '50fa7b' },
      // Add more token rules as needed
    ],
    colors: {
      'editor.foreground': '#f8f8f2',
      'editor.background': '#282a36',
      'editor.selectionBackground': '#44475a',
      'editor.lineHighlightBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f0',
      'editorWhitespace.foreground': '#3b3a32',
      // Add more color configurations as needed
    }
  };
  
  export default draculaTheme;
  