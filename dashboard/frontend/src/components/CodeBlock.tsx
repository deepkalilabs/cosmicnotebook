import React from 'react';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {


  return (
    <pre className='overflow-y-auto'>
      <code className="python ">
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;