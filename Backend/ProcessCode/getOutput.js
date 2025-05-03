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

    let sourceFile;
    switch (language) {
      case 'cpp':
        sourceFile = 'code.cpp';
        break;
      case 'python':
        sourceFile = 'code.py';
        break;
      case 'javascript':
        sourceFile = 'code.js';
        break;
      case 'java':
        sourceFile = 'code.java';
        break;
      case 'go':
        sourceFile = 'code.go';
        break;
      default:
        return reject(new Error(`Unsupported language: ${language}`));
    }

    const runCmd = `docker run --rm --cpus="1.0" --memory="${memorylimit}m" -v ${dockerDir}:/sandbox cpp-sandbox ${sourceFile}`;

    exec(runCmd, { timeout: parseInt(timelimit) * 1000 }, (err) => {
      try {
        if (fs.existsSync(timelimitFile)) {
          fs.unlinkSync(timelimitFile);
        }
        if (fs.existsSync(memorylimitFile)) {
          fs.unlinkSync(memorylimitFile);
        }
      } catch (cleanupErr) {
        console.error('Failed to delete files:', cleanupErr);
      }

      if (err) {
        if (err.killed) {
          // Write "Time Limit Exceeded" to verdict.txt
          fs.appendFileSync(verdictFile, "\nTime Limit Exceeded");
          resolve({
            success: true,
            type: "TLE",
            output: "Time Limit Exceeded",
          });
        } else {
          // Read error from verdict.txt
          const verdictContent = fs.existsSync(verdictFile) 
            ? fs.readFileSync(verdictFile, 'utf8') 
            : 'Unknown error occurred';
          
          // Determine if it's a compilation error or runtime error
          const isCompilationError = verdictContent.includes('Compilation failed') || 
                                    (language === 'cpp' && (verdictContent.includes('error:') || verdictContent.includes('undefined reference'))) ||
                                    (language === 'java' && verdictContent.includes('error:')) ||
                                    (language === 'go' && verdictContent.includes('cannot find package'));
          
          resolve({
            success: true,
            type: isCompilationError ? "CE" : "RE",
            output: verdictContent,
          });
        }
      } else {
        // Read the final output from verdict.txt
        const finalOutput = fs.existsSync(verdictFile) 
          ? fs.readFileSync(verdictFile, 'utf8') 
          : 'No output';

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