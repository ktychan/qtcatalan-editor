import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import DyckPath from "./dyck";
import "./chains.scss";
import arrayMove from "array-move";

function Chain(props) {
  const paths = props.chain.map((data, j) => (
    <div key={j} onClick={props.createClickHandlerOnPath(j)}>
      <DyckPath data={data} unit={20} margin={2} selected={data.selected} />
    </div>
  ));
  return <div className="dyck-chain">{paths}</div>;
}

export default class ChainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chains: [],
    };
    this.path = props.path;
    this.undos = [];
    this.handleFirebaseUpdate = this.handleFirebaseUpdate.bind(this);
    this.createClickHandlerOnChain = this.createClickHandlerOnChain.bind(this);
    console.log(this.path)

    // a convienent way to define movement functions and call .bind(this) on them.
    this.keypressEventHandlers = {
      " ": this.handleClearSelection,
      w: this.handlePathMoveUp,
      a: this.handlePathMoveLeft,
      s: this.handlePathMoveDown,
      d: this.handlePathMoveRight,
      q: this.handlePathMoveToFront,
      e: this.handlePathMoveToEnd,
      j: this.handleChainMoveDown,
      k: this.handleChainMoveUp,
      u: this.handleUndo,
    };
    for (let key in this.keypressEventHandlers) {
      this.keypressEventHandlers[key] = this.keypressEventHandlers[key].bind(
        this
      );
    }
    this.dispathKeypressEvents = this.dispathKeypressEvents.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keypress", this.dispathKeypressEvents);
    firebase
      .database()
      .ref(`${this.path}`)
      .on("value", this.handleFirebaseUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.dispathKeypressEvents);
    firebase
      .database()
      .ref(`${this.path}`)
      .off("value", this.handleFirebaseUpdate);
  }

  render() {
    return (
      <div>
        {this.state.chains.map((chain, i) => (
          <Chain
            key={i}
            chain={chain}
            createClickHandlerOnPath={this.createClickHandlerOnChain(i)}
          />
        ))}
      </div>
    );
  }

  handleFirebaseUpdate(snapshot) {
    this.setState({
      chains: snapshot.val().map((chain, i) => {
        return chain.map((data, j) => {
          return {
            sage: data,
            word: data[0],
            area: data[1],
            dinv: data[2],
            bounce: data[3],
            selected: false,
          };
        });
      }),
    });
  }

  // onClick event hander creators
  createClickHandlerOnChain(i) {
    return (j) => {
      return (e) => {
        let chains = [...this.state.chains];
        chains[i][j].selected = !chains[i][j].selected;
        this.setState(chains);
      };
    };
  }

  // keyboard event listeners
  dispathKeypressEvents(e) {
    try {
      if (e.key !== "u") {
        this.undos.push(this.state);
      }
      this.keypressEventHandlers[e.key](e);
    } catch (error) {
      this.undos.pop();
    }
  }

  handleUndo(e) {
    // keep at most 100 undos.
    if (this.undos.length >= 100) {
      this.undos.shift();
    }
    this.setState(this.undos.pop());
  }

  handleClearSelection(e) {
    this.setState({
      chains: this.state.chains.map((chain) =>
        chain.map((path) => {
          const newPath = { ...path };
          newPath.selected = false;
          return newPath;
        })
      ),
    });

    e.preventDefault();
  }

  handlePathMoveUp(e) {
    let new_chains = [...this.state.chains];
    for (let i = 0; i < this.chains.length; i++) {
      const chain = this.state.chains[i];
      for (let j=0; i < chain.length; j++) {
        const next_chain = this.state.chains[i+1];
        if (next_chain) {
          if (j < next_chain.length) {
            // todo
          }
        }
      }
    }

    this.setState({chains: new_chains});
  }

  handlePathMoveDown(e) {}

  handlePathMoveLeft(e) {
    this.setState({
      chains: this.state.chains.map((chain, i) => {
        const new_chain = [...chain];
        for (let j = 1; j < chain.length; j++) {
          if (chain[j].selected && !new_chain[j - 1].selected) {
            arrayMove.mutate(new_chain, j, j - 1);
          }
        }
        return new_chain;
      }),
    });
  }

  handlePathMoveRight(e) {
    this.setState({
      chains: this.state.chains.map((chain, i) => {
        const new_chain = [...chain];
        for (let j = chain.length - 2; j >= 0; j--) {
          if (chain[j].selected) {
            arrayMove.mutate(new_chain, j, j + 1);
          }
        }
        return new_chain;
      }),
    });
  }

  handlePathMoveToFront(e) {
    this.setState({
      chains: this.state.chains.map((chain, i) => {
        const new_chain = [...chain];
        let k = 0;
        for (let j = 1; j < chain.length; j++) {
          if (chain[j].selected) {
            arrayMove.mutate(new_chain, j, k);
            k++;
          }
        }
        return new_chain;
      }),
    });
  }

  handlePathMoveToEnd(e) {
    this.setState({
      chains: this.state.chains.map((chain, i) => {
        const new_chain = [...chain];
        let k = 0;
        for (let j = chain.length-1; j >= 0; j--) {
          if (chain[j].selected) {
            arrayMove.mutate(new_chain, j, chain.length-1-k);
            k++;
          }
        }
        return new_chain;
      }),
    });
  }

  handleChainMoveDown(e) {
    const new_chains = [...this.state.chains];
    for (let i = this.state.chains.length - 2; i >= 0; i--) {
      if (
        this.isChainSelected(this.state.chains[i]) &&
        !this.isChainSelected(new_chains[i + 1])
      ) {
        arrayMove.mutate(new_chains, i, i + 1);
      }
    }

    this.setState({ chains: new_chains });
  }

  handleChainMoveUp(e) {
    const new_chains = [...this.state.chains];
    for (let i = 1; i < this.state.chains.length; i++) {
      if (
        this.isChainSelected(this.state.chains[i]) &&
        !this.isChainSelected(new_chains[i - 1])
      ) {
        arrayMove.mutate(new_chains, i, i - 1);
      }
    }

    this.setState({ chains: new_chains });
  }

  isChainSelected(chain) {
    let selected = false;
    for (let j in chain) {
      if (chain[j].selected) {
        selected = true;
        break;
      }
    }
    return selected;
  }
}
