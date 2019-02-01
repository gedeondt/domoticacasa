import React, { Component } from 'react';
import { Box, Button, Text } from 'grommet';
import _ from 'lodash';

const PARADO =  0
const SUBIENDO = 1
const BAJANDO = 2

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
          label={"Subir"}
          primary={this.props.on}
          onClick={() => this.props.toggleBlind(this.props.title, SUBIENDO) }
        />
        <Button
          margin="xsmall"
          label={"Bajar"}
          primary={this.props.on}
          onClick={() => this.props.toggleBlind(this.props.title, BAJANDO) }
        />
      </Box>
    )
   }
}