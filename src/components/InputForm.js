import React, { Component } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';

class InputForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      account: '',
      startingBlock: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.handleInputForm(this.state.account, this.state.startingBlock);
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group inline widths="equal">
          <Form.Field>
            <Input
              value={this.state.account}
              onChange={event => this.setState({ account: event.target.value.toLowerCase() })}
              placeholder="Address..." />
          </Form.Field>
          <Form.Field>
            <Input
              value={this.state.startingBlock}
              onChange={event => this.setState({ startingBlock: event.target.value })}
              placeholder="Block number..." />
          </Form.Field>
          <Button primary>Submit</Button>
        </Form.Group>
      </Form>
    );
  }
}

export default InputForm;