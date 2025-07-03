const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const getOutput = (language = 'cpp') => {
  const timelimitFile = path.join(__dirname, '..', 'Docker', 'timelimit.txt');
  const memorylimitFile = path.join(__dirname, '..', 'Docker', 'memorylimit.txt');
  const verdictFile = path.join(__dirname, '..', 'Docker', 'verdict.txt');
  const inputFile = path.join(__dirname, '..', 'Docker', 'input.txt');
  const dockerDir = path.join(__dirname, '..', 'Docker');

  return new Promise((resolve, reject) => {
    // Clear verdict file before execution
    if (fs.existsSync(verdictFile)) {
      fs.writeFileSync(verdictFile, '');
    }

    let timelimit = '5';
    if (fs.existsSync(timelimitFile)) {
      const fileContent = fs.readFileSync(timelimitFile, 'utf8').trim();
      if (fileContent) {
        timelimit = fileContent;
      } else {
        fs.writeFileSync(timelimitFile, timelimit);
      }
    } else {
      fs.writeFileSync(timelimitFile, timelimit);
    }

    let memorylimit = '256'; 
    if (fs.existsSync(memorylimitFile)) {
      const fileContent = fs.readFileSync(memorylimitFile, 'utf8').trim();
      if (fileContent) {
        memorylimit = fileContent;
      } else {
        fs.writeFileSync(memorylimitFile, memorylimit);
      }
    } else {
      fs.writeFileSync(memorylimitFile, memorylimit);
    }

    let sourceFile, imageName;
    switch (language) {
      case 'cpp':
        sourceFile = 'code.cpp';
        imageName = 'cpp-sandbox';
        break;
      case 'python':
        sourceFile = 'code.py';
        imageName = 'cpp-sandbox';
        break;
      case 'javascript':
        sourceFile = 'code.js';
        imageName = 'cpp-sandbox';
        break;
      case 'java':
        sourceFile = 'Main.java';
        imageName = 'cpp-sandbox';
        break;
      case 'go':
        sourceFile = 'code.go';
        imageName = 'cpp-sandbox';
        break;
      default:
        return reject(new Error(`Unsupported language: ${language}`));
    }

    // Improved Docker command with proper escaping and container naming
    // Use host path for Docker-in-Docker volume mounting
    const hostDockerDir = '/Users/poornachandradoddi/Documents/Projects/Code-editor/Code-editor/Backend/Docker';
    const containerName = `code-exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const runCmd = `docker run --rm --name="${containerName}" -v "${hostDockerDir}:/sandbox" "${imageName}" "${sourceFile}"`;

    console.log(`Executing: ${runCmd}`);

    exec(runCmd, { 
      timeout: parseInt(timelimit) * 1000 + 2000, // Add 2 second buffer
      maxBuffer: 1024 * 1024 // 1MB buffer
    }, (err, stdout, stderr) => {
      console.log('Docker execution result:');
      console.log('Error:', err);
      console.log('Stdout:', stdout);
      console.log('Stderr:', stderr);
      // Cleanup function
      const cleanup = () => {
        try {
          if (fs.existsSync(timelimitFile)) {
            fs.unlinkSync(timelimitFile);
          }
          if (fs.existsSync(memorylimitFile)) {
            fs.unlinkSync(memorylimitFile);
          }
        } catch (cleanupErr) {
          console.error('Failed to cleanup files:', cleanupErr);
        }
      };

      if (err) {
        cleanup();
        
        if (err.killed || err.signal === 'SIGKILL' || err.code === 124) {
          // Time Limit Exceeded
          fs.writeFileSync(verdictFile, "Time Limit Exceeded");
          resolve({
            success: true,
            type: "TLE",
            output: "Time Limit Exceeded",
          });
        } else {
          // Read error from verdict.txt or use stderr
          let errorOutput = '';
          if (fs.existsSync(verdictFile)) {
            errorOutput = fs.readFileSync(verdictFile, 'utf8');
          }
          if (!errorOutput && stderr) {
            errorOutput = stderr;
          }
          if (!errorOutput && stdout) {
            errorOutput = stdout;
          }
          if (!errorOutput) {
            errorOutput = err.message || 'Unknown error occurred';
          }
          
          // Determine if it's a compilation error or runtime error
          const isCompilationError = errorOutput.includes('Compilation failed') || 
                                    errorOutput.includes('compilation terminated') ||
                                    (language === 'cpp' && (errorOutput.includes('error:') || errorOutput.includes('undefined reference'))) ||
                                    (language === 'java' && errorOutput.includes('error:')) ||
                                    (language === 'python' && errorOutput.includes('SyntaxError')) ||
                                    (language === 'go' && errorOutput.includes('cannot find package')) ||
                                    errorOutput.includes('No such file or directory');
          
          resolve({
            success: true,
            type: isCompilationError ? "CE" : "RE",
            output: errorOutput.trim(),
          });
        }
      } else {
        cleanup();
        
        // Read the final output from verdict.txt
        let finalOutput = '';
        if (fs.existsSync(verdictFile)) {
          finalOutput = fs.readFileSync(verdictFile, 'utf8');
        }
        
        // If verdict.txt is empty, use stdout
        if (!finalOutput.trim() && stdout) {
          finalOutput = stdout.trim();
        }
        
        if (!finalOutput.trim()) {
          finalOutput = 'No output';
        }

        resolve({
          success: true,
          type: 'AC',
          output: finalOutput,
        });
      }
    });
  });
};

module.exports = getOutput;