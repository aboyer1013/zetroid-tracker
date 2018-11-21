import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

const name = observable({
    name: 'aaron',
    change: action(() => {
        name.name = 'kevin';
    })
});
const App = observer((props) => {
    return (
        <div>
            <button onClick={props.name.change}>Change</button>
            <h1>ohai {props.name.name}</h1>
            </div>
    );
});
const rootElement = document.getElementById("root");
ReactDOM.render(<App name={name} />, rootElement);
