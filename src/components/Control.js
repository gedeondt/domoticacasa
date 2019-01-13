import React, { Component } from 'react';
import { Box, Button, Tabs, Tab } from 'grommet';

const PARADO =  0
const SUBIENDO = 1
const BAJANDO = 2

export default class Control extends Component {

  state = { blinds: null }

  toggleBlind(key, value) {
    if(this.state.blinds[key] != PARADO)
    {
      this.props.firebase.database().ref('persianas/'+key).set(PARADO);
    } else {
      this.props.firebase.database().ref('persianas/'+key).set(value);
    }
  }

  componentWillMount() {
    this.props.firebase.database().ref('persianas').on('value', (snapshot) => this.setState({ blinds: snapshot.val() }) );
  }

  renderBlinds(blinds) {
      return Object.keys(blinds).map((key) => <div>
        <Button
          margin="small"
          key={key}
          label={"Subir " + key}
          primary={blinds[key] > 0}
          onClick={() => this.toggleBlind(key, SUBIENDO) }
        />
        <Button
          margin="small"
          key={key}
          label={"Bajar " + key}
          primary={blinds[key] > 0}
          onClick={() => this.toggleBlind(key, BAJANDO) }
        />
    </div>)
  }

  render() {
    return (
        <Tabs flex>
            <Tab title="Persianas">
                { this.state.blinds && this.renderBlinds(this.state.blinds) }
            </Tab>
        </Tabs>
    )
   }
}