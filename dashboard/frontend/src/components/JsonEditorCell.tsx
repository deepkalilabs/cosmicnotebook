import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Maximize2, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Editor } from '@monaco-editor/react';

const JsonEditorCell = ({ value, onChange, isEditing, endpoint }: { value: string, onChange: (value: string) => void, isEditing: boolean, endpoint: string }) => {
  const [jsonValue, setJsonValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [curlRequest, setCurlRequest] = useState('');
  const [showCurlRequest, setShowCurlRequest] = useState(false);
  
  // Format JSON string with proper indentation
  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.error(e);
      return jsonString;
    }
  };

  useEffect(() => {
    if (jsonValue.length > 10) {
      attemptToFixJson(jsonValue);
      onChange(jsonValue);
    }
  }, [jsonValue]);

  // Copy formatted JSON to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatJson(jsonValue));
  };

  // Modify to only update the value without validation
  const handleInputChange = (newValue: string) => {
    setJsonValue(newValue);
  };

  const attemptToFixJson = (value: string) => {
    try {
      let fixedValue = value;
      
      // Replace single quotes with double quotes
      fixedValue = fixedValue.replace(/'/g, '"');
      
      // Add missing quotes around property names
      fixedValue = fixedValue.replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*\:/g, '$1"$2":');
      
      // Try to parse the fixed JSON
      const parsed = JSON.parse(fixedValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonValue(formatted);
      setIsValid(true);
      setError('');
        
    } catch (error: Error | unknown) {
      setIsValid(false);
      setError('Unable to fix JSON: ' + (error as Error).message);
    }
  };

  // Function to parse and update parent
  const parseAndUpdate = (value: string) => {
    try {
        attemptToFixJson(value);
        const parsed = JSON.parse(jsonValue);
        const formatted = JSON.stringify(parsed, null, 2);
        setJsonValue(formatted);
        setIsValid(true);
        setError('');
        onChange(formatted);
    } catch (e: Error | unknown) {
        setIsValid(false);
        setError((e as Error).message);
    }
  };

  const generateCurlRequest = () => {
    const curlCommand = `curl -X POST \\
-H "Content-Type: application/json" \\
-d '${jsonValue}' \\
${endpoint}`;
    setCurlRequest(curlCommand);
    setShowCurlRequest(true);
  };

  // Handle initial value
  useEffect(() => {
    if (value) {
      parseAndUpdate(value);
    }
  }, [value]);

  if (!isEditing) {
    return (
      <div className="relative group">
        <pre className="whitespace-pre-wrap overflow-x-auto p-2 bg-gray-50 rounded-md text-sm">
          {formatJson(value)}
        </pre>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={copyToClipboard}
            className="p-1 hover:bg-gray-200 rounded-md"
            title="Copy JSON"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl max-h-[120vh] h-auto">
          <DialogHeader>
            <DialogTitle>Edit JSON</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col min-h-[200px] max-h-[calc(80vh-100px)] overflow-auto">
            <div className="relative flex-1">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-50 border-r text-gray-400 text-xs leading-5 select-none">
                {Array.from({ length: jsonValue.split('\n').length }).map((_, i) => (
                  <div key={i} className="px-2">{i + 1}</div>
                ))}
              </div>
              
              <Editor
                className="w-full h-full min-h-[200px]"
                defaultLanguage="json"
                value={jsonValue}
                onChange={(value) => handleInputChange(value || '')}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  tabSize: 2,
                }}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => parseAndUpdate(jsonValue)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
              >
                Parse & Update
              </Button>
            </div>

            {!isValid && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Invalid JSON: {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Editor
          className="w-full min-h-[150px] px-3 py-2 text-sm font-mono border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultLanguage="json"
          value={jsonValue}
          onChange={(value) => handleInputChange(value || '')}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            fontSize: 12,
            fontFamily: 'monospace',
            tabSize: 2,
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="p-1 hover:bg-gray-200 rounded-md"
            title="Copy JSON"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFullscreen(true)}
            className="p-1 hover:bg-gray-200 rounded-md"
            title="Expand editor"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-row gap-2 mt-2 justify-end">
          <Button
            onClick={() => parseAndUpdate(jsonValue)}
          >
            Parse & Update
          </Button>

          <Button
            onClick={() => generateCurlRequest()}
          >
            cURL Request
          </Button>
        </div>

        {showCurlRequest && (
          <div className="mt-2 relative">
            <pre className="whitespace-pre overflow-x-auto p-2 bg-gray-50 rounded-md text-sm font-mono">
              {curlRequest}
            </pre>
            <Button
              variant="ghost" 
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-md"
              onClick={() => setShowCurlRequest(false)}
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {!isValid && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid JSON: {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default JsonEditorCell;