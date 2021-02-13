import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class ResetForm extends Component {
  constructor(props){
    super(props);
    this.onReset = this.onReset.bind(this);
  }

  onReset(event) {
    event.preventDefault();
    this.props.handleInputForm('', '');
  }

  render() {
    return (
      <Button primary onClick={this.onReset} disabled={!this.props.enabled}>Reset</Button>
    );
  }
}

export default ResetForm;