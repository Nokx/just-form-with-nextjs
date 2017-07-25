import React, { Component } from 'react';
import DictionarySelect from './DictionarySelect';

const initialState = {
  id: "",
  number: "",
  name: "",
  toUserId: "",
  fromUserId: "",
  statusId: ""
};

class ProposalForm extends Component {
  state = initialState;

  componentDidMount()
  {
    this.setState({ ...this.props.proposal });
  }

  componentWillReceiveProps(nextProps)
  {
    const { proposal } = this.props;
    if (proposal) {
      if (!nextProps.proposal) {
        this.setState(initialState);
        return
      }
      if (nextProps.proposal && proposal.id !== nextProps.proposal.id) {
        this.setState({ ...nextProps.proposal });
      }
    } else {
      if (nextProps.proposal) {
        this.setState({ ...nextProps.proposal });
      }
    }
  }

  onPropChange = (event) => {
    this.setState({ [event.currentTarget.dataset.elid]: event.target.value });
  };

  onSaveClick = (event) => {
    event.preventDefault();
    this.props.onProposalEdit(this.state);
  };

  onCreateClick = (event) => {
    event.preventDefault();
    this.props.onProposalCreate(this.state);
  };

  render()
  {
    return (
      <form className="proposal-form">

        <div className="input-field">
          <input type="text"
                 data-elid="name"
                 placeholder="Название"
                 value={this.state.name}
                 onChange={this.onPropChange}
          />
        </div>

        <div className="input-field">
          <input type="text"
                 data-elid="number"
                 placeholder="Номер"
                 value={this.state.number}
                 onChange={this.onPropChange}
          />
        </div>

        <DictionarySelect elements={this.props.users}
                          label="Кому"
                          value={this.state.toUserId}
                          elid="toUserId"
                          onChange={this.onPropChange}
        />

        <DictionarySelect elements={this.props.users}
                          label="От Кого"
                          value={this.state.fromUserId}
                          elid="fromUserId"
                          onChange={this.onPropChange}
        />

        <DictionarySelect elements={this.props.statuses}
                          label="Статус"
                          value={this.state.statusId}
                          elid="statusId"
                          onChange={this.onPropChange}
        />

        <div className="errors">
          {this.props.errors.map(error => <div key={error}>{error}</div>)}
        </div>

        {this.state.id && <button className="btn" onClick={this.onSaveClick}>Сохранить</button>}
        <button className="btn" onClick={this.onCreateClick}>Создать</button>
      </form>
    )
  }
}

export default ProposalForm;