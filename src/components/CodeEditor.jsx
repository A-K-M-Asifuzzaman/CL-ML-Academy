import { useRef, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { T } from '../theme.js';

const ACADEMY_THEME = 'academyDark';

function defineTheme(monaco) {
  monaco.editor.defineTheme(ACADEMY_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment',           foreground: '546e7a', fontStyle: 'italic' },
      { token: 'keyword',           foreground: 'ff7b72' },
      { token: 'string',            foreground: '9ecbff' },
      { token: 'number',            foreground: '79c0ff' },
      { token: 'type',              foreground: 'b388ff' },
      { token: 'class',             foreground: 'ffd600' },
      { token: 'function',          foreground: '00e5ff' },
      { token: 'variable.other',    foreground: 'c8d6f0' },
      { token: 'identifier',        foreground: 'c8d6f0' },
      { token: 'delimiter',         foreground: '7a90b8' },
    ],
    colors: {
      'editor.background':                '#060b14',
      'editor.foreground':                '#c8d6f0',
      'editor.lineHighlightBackground':   '#0b1120',
      'editorCursor.foreground':          '#00e5ff',
      'editor.selectionBackground':       '#00e5ff25',
      'editorLineNumber.foreground':      '#3a5070',
      'editorLineNumber.activeForeground':'#7a90b8',
      'scrollbarSlider.background':       '#2a3a5c60',
      'scrollbarSlider.hoverBackground':  '#2a3a5c90',
      'editorWidget.background':          '#0b1120',
      'editorSuggestWidget.background':   '#0f1830',
      'editorSuggestWidget.border':       '#2a3a5c',
      'editorSuggestWidget.selectedBackground': '#162040',
      'input.background':                 '#0f1830',
      'input.border':                     '#2a3a5c',
      'focusBorder':                      '#00e5ff',
      'editor.findMatchBackground':       '#00e5ff30',
      'editor.findMatchHighlightBackground': '#00e5ff15',
      'minimap.background':               '#060b14',
    },
  });
}

// Safe JavaScript executor using sandboxed iframe
function createSandbox() {
  const iframe = document.createElement('iframe');
  iframe.sandbox = 'allow-scripts';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  return iframe;
}

function destroySandbox(iframe) {
  if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
}

export function runUserCode(code, inputs, timeoutMs = 3000) {
  return new Promise(resolve => {
    const iframe = createSandbox();
    const results = [];
    let done = false;

    const cleanup = (result) => {
      if (done) return;
      done = true;
      window.removeEventListener('message', handler);
      destroySandbox(iframe);
      resolve(result);
    };

    const tid = setTimeout(() => {
      cleanup({ error: 'Execution timed out (3s limit)', results: [] });
    }, timeoutMs);

    const handler = (e) => {
      if (e.source !== iframe.contentWindow) return;
      const msg = e.data;
      if (msg.type === 'result') {
        results.push(msg.data);
        if (results.length >= inputs.length) {
          clearTimeout(tid);
          cleanup({ results });
        }
      } else if (msg.type === 'error') {
        clearTimeout(tid);
        cleanup({ error: msg.data, results });
      } else if (msg.type === 'ready') {
        inputs.forEach((inp, idx) => {
          iframe.contentWindow.postMessage({ type: 'run', code, input: inp, idx }, '*');
        });
      }
    };

    window.addEventListener('message', handler);

    iframe.srcdoc = `<!DOCTYPE html><html><body><script>
"use strict";
window.addEventListener('message', e => {
  if (e.data.type !== 'run') return;
  const { code, input, idx } = e.data;
  try {
    const fn = new Function('"use strict";\\n' + code + '\\nreturn typeof solution !== "undefined" ? solution : null;');
    const userFn = fn();
    if (!userFn) { window.parent.postMessage({type:'error',data:'No function named "solution" found.'}, '*'); return; }
    const result = userFn(...input);
    window.parent.postMessage({type:'result',data:{idx,result}}, '*');
  } catch(err) {
    window.parent.postMessage({type:'error',data:err.message}, '*');
  }
});
window.parent.postMessage({type:'ready'}, '*');
<\/script></body></html>`;
  });
}

export function runFreeformCode(code, timeoutMs = 5000) {
  return new Promise(resolve => {
    const iframe = createSandbox();
    const logs = [];
    let done = false;

    const cleanup = (result) => {
      if (done) return;
      done = true;
      window.removeEventListener('message', handler);
      destroySandbox(iframe);
      resolve(result);
    };

    const tid = setTimeout(() => {
      cleanup({ logs, error: 'Execution timed out (5s limit)' });
    }, timeoutMs);

    const handler = (e) => {
      if (e.source !== iframe.contentWindow) return;
      const msg = e.data;
      if (msg.type === 'log')   logs.push({ kind: 'log',   text: msg.data });
      if (msg.type === 'error') logs.push({ kind: 'error', text: msg.data });
      if (msg.type === 'done') {
        clearTimeout(tid);
        cleanup({ logs });
      }
    };

    window.addEventListener('message', handler);

    iframe.srcdoc = `<!DOCTYPE html><html><body><script>
"use strict";
const _log = (...a) => window.parent.postMessage({type:'log',data:a.map(v=>typeof v==='object'?JSON.stringify(v,null,2):String(v)).join(' ')}, '*');
const _err = (...a) => window.parent.postMessage({type:'error',data:a.join(' ')}, '*');
const _console = {log:_log,info:_log,warn:_log,error:_err,dir:_log,table:_log};
try {
  (new Function('console',${JSON.stringify(code)}))(_console);
} catch(err) {
  _err('RuntimeError: ' + err.message);
}
window.parent.postMessage({type:'done'}, '*');
<\/script></body></html>`;
  });
}

// Compare test result with expected
export function compareResult(result, expected, comparator = 'default') {
  if (comparator === 'sortedArray') {
    const r = JSON.stringify([...(result||[])].sort());
    const e = JSON.stringify([...(expected||[])].sort());
    return r === e;
  }
  if (comparator === 'anagramGroups') {
    if (!Array.isArray(result) || !Array.isArray(expected)) return false;
    const norm = arr => arr.map(g => [...g].sort().join(',')).sort().join('|');
    return norm(result) === norm(expected);
  }
  if (comparator === 'palindromeOr') {
    const s = String(result);
    return s === String(expected) || s === String(expected).split('').reverse().join('');
  }
  return JSON.stringify(result) === JSON.stringify(expected);
}

// XP bar display component
export function XpBadge({ xp, color = T.cy }) {
  return (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 12,
      background: color + '18', color, border: `1px solid ${color}30`,
      fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      +{xp} XP
    </span>
  );
}

// The Monaco editor wrapper
export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false,
  minimap = false,
}) {
  const editorRef = useRef(null);

  const handleMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    defineTheme(monaco);
    monaco.editor.setTheme(ACADEMY_THEME);
    // Keybind: Cmd/Ctrl+Enter to run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      document.getElementById('run-btn')?.click();
    });
  }, []);

  return (
    <Editor
      height={height}
      language={language}
      theme={ACADEMY_THEME}
      value={value}
      onChange={onChange}
      onMount={handleMount}
      options={{
        fontSize: 13,
        fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", "Consolas", monospace',
        fontLigatures: true,
        lineNumbers: 'on',
        minimap: { enabled: minimap },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        readOnly,
        renderWhitespace: 'none',
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        suggest: { showKeywords: true },
        quickSuggestions: { other: true, comments: false, strings: false },
        folding: true,
        renderLineHighlight: 'line',
        contextmenu: false,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
      loading={
        <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060b14', color: T.t2, fontSize: 13 }}>
          Loading Editor...
        </div>
      }
    />
  );
}
