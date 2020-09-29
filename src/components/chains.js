import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import DyckPath from "./dyck";
import "./chains.scss";

function Chain(props) {
  const paths = props.paths.map((data, i) => <DyckPath key={i} data={data} unit={20} margin={2} />);
  return <div className="dyck-chain">{paths}</div>;
}

export default class ChainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.n = props.match.params.n;
    this.handleFirebaseUpdate = this.handleFirebaseUpdate.bind(this);
    this.state = {
      chains: []
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref(`/current/${this.n}`)
      .on("value",this.handleFirebaseUpdate);
  }

  componentWillUnmount() {
    firebase
      .database()
      .ref(`/current/${this.n}`)
      .off("value", this.handleFirebaseUpdate);
  }

  render() {
    return (<div>
      {this.state.chains.map((paths, i) => <Chain key={i} paths={paths}/>)}
    </div>);
  }

  handleFirebaseUpdate(snapshot) {
    this.setState({
      chains: snapshot.val()
    })
  }
}
