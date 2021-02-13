import React, { Component } from 'react';
import InputForm from './components/InputForm.js';
import ResetForm from './components/ResetForm.js';
import './App.css';
import web3 from './web3';
import { Container, Menu, Header, Icon, Progress, Table, Button, Popup, Card } from 'semantic-ui-react';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      account: '',
      startingBlock: '',
      transactions: [],
      balance: '',
      loaderPercent: 0,
      isCrawlDone: false
    };
    this.handleInputForm = this.handleInputForm.bind(this);
  }

  pushTransaction(block, originalTransaction) {
    const transaction = {
      hash: originalTransaction.hash.toLowerCase(),
      block: block.number,
      from: originalTransaction.from.toLowerCase(),
      to: originalTransaction.to.toLowerCase(),
      value: parseInt(originalTransaction.value),
      fee: originalTransaction.gas * parseInt(originalTransaction.gasPrice),
      timestamp: block.timestamp
    }
    this.setState({transactions: [...this.state.transactions, transaction]});
  }

  handleInputForm(account, startingBlock) {
    this.setState({
      account: account,
      startingBlock: startingBlock,
    });

    if (account === '') {
      this.setState({
        isCrawlDone: false,
        latestBlock: null,
        balance: '',
        transactions: [],
        loaderPercent: 0
      })
    }
    else {
      this.crawlBlockchain();
    }
  }

  async crawlBlockchain() {
    this.setState({
      latestBlock: await web3.eth.getBlockNumber(),
      balance: await web3.eth.getBalance(this.state.account)
    });
    const blocksToCrawl = this.state.latestBlock - this.state.startingBlock;

    for (let i = this.state.startingBlock; i <= this.state.latestBlock; i++) {
      let block = await web3.eth.getBlock(i, true);
      block.transactions.forEach((transaction) => {
        if (transaction.from.toLowerCase() === this.state.account) {
          this.pushTransaction(block, transaction);
        }
        if (transaction.to !== null && transaction.to.toLowerCase() === this.state.account) {
          this.pushTransaction(block, transaction);
        }
      });
      this.setState({loaderPercent: parseInt((i - this.state.startingBlock) / blocksToCrawl * 100)});
    }
    this.setState({isCrawlDone: true});
  }

  renderForm() {
    if (this.state.account === '') {
      return (<InputForm handleInputForm={this.handleInputForm} />);
    }
    return (<ResetForm handleInputForm={this.handleInputForm} enabled={this.state.isCrawlDone} />);
  }

  renderTransactions() {
    return this.state.transactions.map(transaction => {
      return (
        <Table.Row key={transaction.hash}>
          <Table.Cell><Popup content={transaction.hash}
            trigger={<Button compact icon="eye" basic color="blue" size="mini" />} on="click" />
            {transaction.hash}
          </Table.Cell>
          <Table.Cell>{transaction.block}</Table.Cell>
          <Table.Cell>{new Date(transaction.timestamp * 1000).toISOString()}</Table.Cell>
          <Table.Cell><Popup content={transaction.from}
            trigger={<Button compact icon="eye" basic color="blue" size="mini" />} on="click" />
            {transaction.from}
          </Table.Cell>
          <Table.Cell><Popup content={transaction.to}
            trigger={<Button compact icon="eye" basic color="blue" size="mini" />} on="click" />
            {transaction.to}
          </Table.Cell>
          <Table.Cell>{web3.utils.fromWei(transaction.value.toString(), 'ether')} Ether</Table.Cell>
          <Table.Cell>{web3.utils.fromWei(transaction.fee.toString(), 'ether')} Ether</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    return (
      <Container fluid>
        <Menu stackable>
          <Header color="blue" size="medium" style={{ marginTop: '10px' }}>
            <Icon circular name="folder open" size="big" color="blue" />
            TransactionChecker
          </Header>
          <Menu.Item position="right">{this.renderForm()}</Menu.Item>
        </Menu>
        <Container>
          {this.state.account === '' ? null : <Progress percent={this.state.loaderPercent} indicating />}
          <Card.Group itemsPerRow={3} stackable>
            <Card color="blue">
              <Card.Content header="Balance" textAlign="center" description={web3.utils.fromWei(this.state.balance, 'ether') + ' Ether'}/>
            </Card>
            <Card color="blue">
              <Card.Content header="Adress" textAlign="center" description={this.state.account} />
            </Card>
            <Card color="blue">
              <Card.Content header="Block Number" textAlign="center" description={this.state.startingBlock} />
            </Card>
          </Card.Group>
          <Table celled singleLine fixed color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Tnx Hash</Table.HeaderCell>
                <Table.HeaderCell>Block</Table.HeaderCell>
                <Table.HeaderCell>Timestamp</Table.HeaderCell>
                <Table.HeaderCell>From</Table.HeaderCell>
                <Table.HeaderCell>To</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
                <Table.HeaderCell>Tnx Fee</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderTransactions()}</Table.Body>
          </Table>
        </Container>
      </Container>
    );
  }
}

export default App;
