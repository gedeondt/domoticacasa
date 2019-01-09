import React, { Component } from 'react';
import { Box, Button, Tabs, Tab } from 'grommet';

export default class Control extends Component {

  state = { blinds: false }

  toggleBlind(key, value) {
    this.props.firebase.database().ref('persianas/'+key).set(!value);
  }

  componentWillMount() {
    this.props.firebase.database().ref('persianas').on('value', (snapshot) => this.setState({ blinds: snapshot.val() }) );
  }

  renderBlinds(blinds) {
      return Object.keys(blinds).map((key) => <Button
        key={key}
        label={key}
        primary={blinds[key]}
        onClick={() => this.toggleBlind(key, blinds[key]) }
        />)
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