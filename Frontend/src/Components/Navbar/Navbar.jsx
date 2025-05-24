import { NavLink } from "react-router-dom";
import classes from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <NavLink to="/" className={classes.logoLink}>
          CodeJudge
        </NavLink>
      </div>
      <div className={classes.navLinks}>
        <NavLink to="/problems" className={classes.navLink} activeClassName={classes.active}>
          Problems
        </NavLink>
        <NavLink to="/ide" className={classes.navLink} activeClassName={classes.active}>
          IDE
        </NavLink>
      </div>
    </nav>
  );
}