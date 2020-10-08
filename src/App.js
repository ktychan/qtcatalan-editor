import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { range } from "./utils";
import ChainContainer from "./components/chains";
import './App.scss';

class Experiments extends React.Component {

  componentDidMount() {
    // TODO
  }

  componentWillUnmount() {
    // TODO
  }

}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleFirebaseUpdate = this.handleFirebaseUpdate.bind(this);
  }

  render() {
    const pages = range(1,8).map((i) => <li  key={i}><Link to={`/editor/${i}`}><code>n={i}</code></Link></li>);
    return (
      <Router forceRefresh={true}>
        <nav>
          <ul>
            {pages}
          </ul>
          <Experiments  />
        </nav>

        <Switch>
          <Route path="/editor/:n" render={p => <ChainContainer path={`/current/${p.match.params.n}`}/>}/>
          <Route path="/experiments/:type/:n/:name" render={p => <ChainContainer path={`${p.location.pathname}`}/>}/>
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
