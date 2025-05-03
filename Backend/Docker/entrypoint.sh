#!/bin/bash

# Read time limit from timelimit.txt
if [ -f "timelimit.txt" ]; then
  timelimit=$(cat timelimit.txt)
else
  echo "Error: timelimit.txt file not found!" > verdict.txt
  exit 1
fi

# Read memory limit from memorylimit.txt
if [ -f "memorylimit.txt" ]; then
  memorylimit=$(cat memorylimit.txt)
else
  echo "Error: memorylimit.txt file not found!" > verdict.txt
  exit 1
fi

# Determine the language based on file extension
if [ -f "code.cpp" ]; then
  language="cpp"
  source_file="code.cpp"
elif [ -f "code.py" ]; then
  language="python"
  source_file="code.py"
elif [ -f "code.js" ]; then
  language="javascript"
  source_file="code.js"
elif [ -f "code.java" ]; then
  language="java"
  source_file="code.java"
elif [ -f "code.go" ]; then
  language="go"
  source_file="code.go"
else
  echo "Error: No supported source file found!" > verdict.txt
  exit 1
fi

# Handle compilation and execution based on language
case $language in
  cpp)
    # Compile the C++ code
    g++ -O2 -o code $source_file 2> verdict.txt
    if [ $? -eq 0 ]; then
      # Run the compiled program
      timeout "${timelimit}s" ./code < input.txt >> verdict.txt 2>&1
      exit_code=$?
      if [ $exit_code -eq 124 ]; then
        echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
      elif [ $exit_code -ne 0 ]; then
        echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
      fi
    else
      echo "Compilation failed." >> verdict.txt
      exit 1
    fi
    ;;
    
  python)
    # Run Python code directly
    timeout "${timelimit}s" python $source_file < input.txt > verdict.txt 2>&1
    exit_code=$?
    if [ $exit_code -eq 124 ]; then
      echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
    elif [ $exit_code -ne 0 ]; then
      echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
    fi
    ;;
    
  javascript)
    # Run JavaScript code with Node.js
    timeout "${timelimit}s" node $source_file < input.txt > verdict.txt 2>&1
    exit_code=$?
    if [ $exit_code -eq 124 ]; then
      echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
    elif [ $exit_code -ne 0 ]; then
      echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
    fi
    ;;
    
  java)
    # Compile Java code
    javac $source_file 2> verdict.txt
    if [ $? -eq 0 ]; then
      # Find the class name (assuming it's the same as the file name without extension)
      class_name=$(basename $source_file .java)
      # Run the compiled Java program
      timeout "${timelimit}s" java -Xmx${memorylimit}m $class_name < input.txt >> verdict.txt 2>&1
      exit_code=$?
      if [ $exit_code -eq 124 ]; then
        echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
      elif [ $exit_code -ne 0 ]; then
        echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
      fi
    else
      echo "Compilation failed." >> verdict.txt
      exit 1
    fi
    ;;
    
  go)
    # Compile Go code
    go build -o code_go $source_file 2> verdict.txt
    if [ $? -eq 0 ]; then
      # Run the compiled Go program
      timeout "${timelimit}s" ./code_go < input.txt >> verdict.txt 2>&1
      exit_code=$?
      if [ $exit_code -eq 124 ]; then
        echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
      elif [ $exit_code -ne 0 ]; then
        echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
      fi
    else
      echo "Compilation failed." >> verdict.txt
      exit 1
    fi
    ;;
esac