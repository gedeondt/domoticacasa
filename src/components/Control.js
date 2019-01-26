import React, { Component } from 'react';
import { Box, Button, Tabs, Tab } from 'grommet';
import _ from 'lodash';

const PARADO =  0
const SUBIENDO = 1
const BAJANDO = 2

export default class Control extends Component {

  state = { devices: null, mapping: null }

  toggleBlind(key, value) {
    const path = '/users/'+this.props.user.uid+'/'+key
    const did = this.state.mapping[key].device
    if(this.state.devices[did].value != PARADO)
    {
      this.props.firebase.database().ref(path).set(PARADO);
    } else {
      this.props.firebase.database().ref(path).set(value);
    }
  }

  componentWillMount() {
    this.props.firebase.database().ref('/mapping').on('value', (snapshot) => this.setState({ mapping: snapshot.val() }) );
    this.props.firebase.database().ref('/devices').on('value', (snapshot) => this.setState({ devices: snapshot.val() }) );
  }

  renderBlinds(mapping) {
      return Object.keys(mapping).map((key) => <div key={key}>
        <Button
          margin="small"
          label={"Subir " + key}
          primary={mapping[key] > 0}
          onClick={() => this.toggleBlind(key, SUBIENDO) }
        />
        <Button
          margin="small"
          label={"Bajar " + key}
          primary={mapping[key] > 0}
          onClick={() => this.toggleBlind(key, BAJANDO) }
        />
    </div>)
  }

  renderLights(mapping) {
    return Object.keys(mapping).map((key) => <div key={key}>
      <Button
        margin="small"
        label={"Encender " + key}
        primary={mapping[key] > 0}
        onClick={() => this.toggleBlind(key, SUBIENDO) }
      />
      <Button
        margin="small"
        label={"Apagar " + key}
        primary={mapping[key] > 0}
        onClick={() => this.toggleBlind(key, BAJANDO) }
      />
    </div>)
  }

  render() {
    return (
        <Tabs flex>
            <Tab title="Persianas">
                { this.state.mapping && 
                    this.renderBlinds(
                      _.pickBy(this.state.mapping, { 'type' : 'blind' })
                    )
                }
            </Tab>
            <Tab title="Iluminación">
                { this.state.mapping && 
                    this.renderLights(
                      _.pickBy(this.state.mapping, { 'type' : 'light' })
                    )
                }
            </Tab>
        </Tabs>
    )
   }
}