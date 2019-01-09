import React, { Component } from 'react';
import { Box, Button, FormField, TextInput } from 'grommet';

export default class Content extends Component {

    state = { user: '', password: '' }

  onSubmit(event) {
    event.preventDefault()
    this.props.login(this.state.user, this.state.password)
  }
  
  render() {

    const { user, password } = this.state;

    return (
    <form onSubmit={event => this.onSubmit(event) }>
      <Box margin="large" align="center">
        <FormField label='Usuario'>
          <TextInput value={user} onChange={event => this.setState({ user: event.target.value })} />
        </FormField>
        <FormField label='Contraseña'>
          <TextInput value={password} onChange={event => this.setState({ password: event.target.value })} />
        </FormField>
        <Button type='submit' label='Entrar' primary={true} />
      </Box>
    </form>
    )
   }
}