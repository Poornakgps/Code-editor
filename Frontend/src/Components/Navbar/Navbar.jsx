import { NavLink } from "react-router-dom";
import classes from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={classes.navbar}>
      <NavLink to="/problems" className={classes.navLink} activeClassName={classes.active}>
        Problems
      </NavLink>
      <NavLink to="/ide" className={classes.navLink} activeClassName={classes.active}>
        IDE
      </NavLink>
      <NavLink to="/contest" className={classes.navLink} activeClassName={classes.active}>
        Contest
      </NavLink>
    </nav>
  );
}
