import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { range } from "./utils";
import ChainContainer from "./components/chains";
import './App.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleFirebaseUpdate = this.handleFirebaseUpdate.bind(this);
  }

  componentDidMount() {
    // TODO
  }

  componentWillUnmount() {
    // TODO
  }

  render() {
    const pages = range(1,8).map((i) => <li  key={i}><Link to={`${i}`}><code>n={i}</code></Link></li>);
    return (
      <Router forceRefresh={true}>
        <nav>
          <ul>
            {pages}
          </ul>
        </nav>

        <Switch>
          <Route path="/:n" component={ChainContainer}/>
        </Switch>
      </Router>
    );
  }

  toolbar() {

    return (
      <div id="toolbar">
        <div>
          <span>
            Usage:
            <code>SPACE</code> to clear selections. <code>wasd</code> move the
            selected paths. <code>W/S</code> create a new chain above/below and
            move the selected paths there. <code>q/e</code> move the selected
            paths to front/end. <code>j/k</code> move the whole chain up/down.
          </span>
        </div>
      </div>
    );
  }

  handleFirebaseUpdate(snapshot) {
    // TODO
  }
}
