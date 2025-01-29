import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';  // or any other style

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, [code]);

  return (
    <pre className='overflow-y-auto'>
      <code className="python ">
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;