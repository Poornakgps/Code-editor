import { useNavigate } from "react-router-dom";
import classes from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.homepage}>
      <div className={classes.hero}>
        <div className={classes.heroContent}>
          <h1 className={classes.title}>
            Master <span className={classes.highlight}>Competitive Programming</span>
          </h1>
          <p className={classes.subtitle}>
            Practice coding problems, test your solutions, and improve your programming skills with our online judge platform.
          </p>
          <div className={classes.buttonGroup}>
            <button 
              className={classes.primaryBtn}
              onClick={() => navigate('/problems')}
            >
              Solve Problems
            </button>
            <button 
              className={classes.secondaryBtn}
              onClick={() => navigate('/ide')}
            >
              Try IDE
            </button>
          </div>
        </div>
        <div className={classes.heroImage}>
          <div className={classes.codeWindow}>
            <div className={classes.windowHeader}>
              <div className={classes.windowControls}>
                <span className={classes.control}></span>
                <span className={classes.control}></span>
                <span className={classes.control}></span>
              </div>
            </div>
            <div className={classes.codeContent}>
              <pre>{`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`}</pre>
            </div>
          </div>
        </div>
      </div>
      
      <div className={classes.features}>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>💻</div>
          <h3>Multi-Language Support</h3>
          <p>C++, Python, JavaScript, Java, and Go</p>
        </div>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>⚡</div>
          <h3>Real-time Execution</h3>
          <p>Instant feedback on your code submissions</p>
        </div>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>🔒</div>
          <h3>Secure Environment</h3>
          <p>Docker-based sandboxed code execution</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;