/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import InputComponent from './InputComponent/InputComponent';
import OutputComponent from './OutputComponent/OutputComponent';
import classes from './CodeEditor.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { message } from 'antd';

const languageTemplates = {
  cpp: `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::getline(std::cin, name);
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
  javascript: `const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('', name => {
  console.log(\`Hello, \${name}!\`);
  readline.close();
});`,
  python: `name = input()
print(f"Hello, {name}!")`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        scanner.close();
    }
}`,
  go: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    name, _ := reader.ReadString('\\n')
    fmt.Printf("Hello, %s!", name)
}`,
};

const monacoLanguageMap = {
  cpp: 'cpp',
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  go: 'go',
};

const CodeEditor = ({ type, sampleInput }) => {
  const { id } = useParams();
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState(languageTemplates.cpp);
  const [input, setInput] = useState(sampleInput || '');
  const [output, setOutput] = useState('Output comes here');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleRunAndSubmitCode = async (isSubmit = false) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setOutput('Processing...');
    
    const payload = {
      code,
      language,
      input,
      problemId: isSubmit ? id : undefined
    };
    
    try {
      const endpoint = isSubmit ? '/submitCode' : '/run';
      const res = await axios.post(endpoint, payload);
      
      setOutput(res.data.output);
      
      if (isSubmit) {
        if (res.data.status === "AC") {
          message.success("Congratulations! Your solution is correct");
        } else if (res.data.status === "WA") {
          message.error("Wrong Answer: Your solution is incorrect");
        } else if (res.data.status === "TLE") {
          message.error("Time Limit Exceeded");
        } else if (res.data.status === "CE") {
          message.error("Compilation Error");
        } else {
          message.error("Runtime Error");
        }
      }
    } catch (error) {
      console.error('Error processing code:', error);
      setOutput('Error: ' + (error.response?.data?.error || error.message || 'Unknown error occurred'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={classes.codeEditorCont} style={type === 'ide' ? { width: '98vw', marginTop: "4rem" } : { width: "97%" }}>
      <div className={classes.editControls}>
        <select value={language} onChange={handleLanguageChange} className={classes.selectInput}>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
        </select>
        <select value={theme} onChange={handleThemeChange} className={classes.selectInput}>
          <option value="vs-light">Light</option>
          <option value="vs-dark">Dark</option>
        </select>
      </div>
      <MonacoEditor
        height="50vh"
        language={monacoLanguageMap[language]}
        theme={theme}
        value={code}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 16,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 1 + "rem" },
        }}
        onChange={handleEditorChange}
        className={classes.monacoEditor}
      />
      <div className={classes.ioContainer}>
        <InputComponent input={input} setInput={setInput} />
        <OutputComponent output={output} />
      </div>
      <div className={classes.buttonContainer}>
        <button 
          onClick={() => handleRunAndSubmitCode(false)} 
          className={classes.runButton}
          disabled={isProcessing}
        >
          {isProcessing ? 'Running...' : 'Run'}
        </button>
        {id && (
          <button 
            onClick={() => handleRunAndSubmitCode(true)} 
            className={classes.submitButton}
            disabled={isProcessing}
          >
            {isProcessing ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;