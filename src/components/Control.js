import React, { Component } from 'react';
import { Box, Button, Tabs, Tab, Text, Grid } from 'grommet';
import _ from 'lodash';
import BlindToggle from './BlindToggle';

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
      this.props.firebase.database().ref(path).set(PARADO)
    } else {
      this.props.firebase.database().ref(path).set(value)
    }
  }

  toggleAllBlinds(value) {
    for(var key in _.pickBy(this.state.mapping, { 'type' : 'blind' }))
    {
      const path = '/users/'+this.props.user.uid+'/'+key
      this.props.firebase.database().ref(path).set(value)
    }
  }

  componentWillMount() {
    this.props.firebase.database().ref('/mapping').on('value', (snapshot) => this.setState({ mapping: snapshot.val() }) );
    this.props.firebase.database().ref('/devices').on('value', (snapshot) => this.setState({ devices: snapshot.val() }) );
  }

  renderBlinds(mapping) {
      return Object.keys(mapping).map((key) =>
      <BlindToggle 
        key={key}
        title={key}
        on={this.state.devices[this.state.mapping[key].device].value > 0}
        toggleBlind={ (key, value) => this.toggleBlind(key, value) }
      />)
  }

  render() {
    return (
        <Tabs flex>
            <Tab title="Persianas">
              <Grid
                columns={{
                  count: 3,
                  size: "auto"
                }}
                gap="small"
              >
                <BlindToggle 
                  title="todas"
                  on={false}
                  toggleBlind={ (key, value) => this.toggleAllBlinds(value) }
                />
                { this.state.mapping && this.state.devices &&
                    this.renderBlinds(
                      _.pickBy(this.state.mapping, { 'type' : 'blind' })
                    )
                }
              </Grid>
            </Tab>
        </Tabs>
    )
   }
}