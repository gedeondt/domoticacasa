import React, { Component } from 'react';
import { Box, Button, Text } from 'grommet';
import _ from 'lodash';

const APAGADO =  0
const ENCENDIDO = 1

export default class BlindToggle extends Component {

  render() {
    return (
        <Box
        align="center"
        background={{ color: "dark-2", opacity: "strong" }}
        pad="small"
        margin="small"
        round
      >
        <Text size="small">{this.props.title}</Text>

        <Button
          margin="xsmall"
          label={this.props.on ? "Apagar" : "Encender" }
          primary={this.props.on}
          onClick={() => this.props.toggleLight(this.props.title) }
        />
      </Box>
    )
   }
}