import React, { Component } from 'react';
import axios from 'axios';
import omit from 'lodash/omit';
import Page from '../layouts/main';
import ProposalForm from '../components/ProposalForm';

class Index extends Component {
  state = {
    selectedId: "",
    proposals: {},
    users: {},
    statuses: {},
    errors: []
  };

  componentDidMount()
  {
    const { proposals, users, statuses } = this.props;
    this.setState({ proposals, users, statuses });
  }

  onProposalDelete = (event) => {
    const proposalId = event.currentTarget.dataset.elid;
    axios.delete(`http://localhost:4000/proposals/${proposalId}`)
      .then(response => {
        const proposals = omit(this.state.proposals, [proposalId]);
        this.setState({
          proposals,
          selectedId: this.state.selectedId === proposalId ? "" : this.state.selectedId
        });
      }).catch(err => {
      this.setState({
        errors: ["Ошибка выполнения запроса"]
      });
    })
  };

  checkProposal(proposal, isNew = false)
  {
    const errors = [];

    if (!isNew) {
      if (!proposal.id) {
        errors.push("Не выбран элемент для редактирования");
        return errors;
      }
    }
    if (!proposal.name) { errors.push("Не заполнено поле 'Имя'") }
    if (!proposal.number) { errors.push("Не заполнено поле 'Номер'") }
    if (!proposal.toUserId) { errors.push("Не выбрано значение в поле 'Кому'") }
    if (!proposal.fromUserId) { errors.push("Не выбрано значение в поле 'От Кого'") }
    if (!proposal.statusId) { errors.push("Не выбрано значение в поле 'Статус'") }

    return errors;
  }

  onProposalEdit = (newProposal) => {
    const errors = this.checkProposal(newProposal);
    if (errors.length) {
      this.setState({ errors });
      return
    }

    const oldState = this.state;
    const newState = {
      ...this.state,
      errors: [],
      proposals: {
        ...this.state.proposals,
        [newProposal.id]: { ...newProposal }
      }
    };

    this.setState(newState); //optimistic update
    axios.patch(`http://localhost:4000/proposals/${newProposal.id}`, newProposal)
      .catch(() => {
      this.setState({
        ...oldState,
        errors: ["Ошибка выполнения запроса"]
      });
    })
  };

  onProposalCreate = (propos) => {
    const proposal = omit(propos, ["id"]);
    const errors = this.checkProposal(proposal, true);
    if (errors.length) {
      this.setState({ errors });
      return
    }

    axios.post(`http://localhost:4000/proposals`, proposal)
      .then(response => {
        const createdProposal = response.data;
        const proposals = { ...this.state.proposals, [createdProposal.id]: createdProposal };
        this.setState({ proposals, errors: [] });
      }).catch(err => {
      this.setState({
        errors: ["Ошибка выполнения запроса"]
      });
    })
  };

  onProposalSelect = (event) => {
    if (event.target.dataset.elementType === "action-delete") {
      return
    }

    this.setState({ selectedId: event.currentTarget.dataset.elid });
  };

  renderProposals()
  {
    return Object.values(this.state.proposals).map(({ id, name, number, toUserId, fromUserId, statusId }) => {
      return (
        <tr key={id}
            data-elid={id}
            onClick={this.onProposalSelect}
            className={+this.state.selectedId === id ? "selected-row" : ""}
        >
          <td>{name}</td>
          <td>{number}</td>
          <td>{this.state.users[toUserId].name}</td>
          <td>{this.state.users[fromUserId].name}</td>
          <td>{this.state.statuses[statusId].name}</td>
          <td>
            <i
              className="material-icons"
              data-elid={id}
              data-element-type="action-delete"
              onClick={this.onProposalDelete}
            >
              delete
            </i>
          </td>
        </tr>
      )
    })
  }

  render()
  {

    return (
      <Page>
        <div className="row main-container">
          <div className="col s8">
            <table className="bordered highlight">
              <thead>
              <tr>
                <th>Название</th>
                <th>Номер</th>
                <th>Кому</th>
                <th>От кого</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
              </thead>

              <tbody>
                {this.renderProposals()}
              </tbody>
            </table>
          </div>
          <div className="col s4 detail-container">
            <ProposalForm proposal={this.state.proposals[this.state.selectedId]}
                          users={Object.values(this.state.users)}
                          statuses={Object.values(this.state.statuses)}
                          errors={this.state.errors}
                          onProposalEdit={this.onProposalEdit}
                          onProposalCreate={this.onProposalCreate}
            />
          </div>
        </div>
      </Page>
    )
  }
}

const arrayToMap = (array, keyName) => {
  return array.reduce(function (acc, obj) {
    acc[obj[keyName]] = obj;
    return acc;
  }, {});
};

Index.getInitialProps = async ({ req }) => {
  const proposalReq = await axios.get('http://localhost:4000/proposals');
  const userReq = await axios.get('http://localhost:4000/users');
  const statusReq = await axios.get('http://localhost:4000/statuses');

  const proposals = arrayToMap((await proposalReq).data, "id");
  const users = arrayToMap((await userReq).data, "id");
  const statuses = arrayToMap((await statusReq).data, "id");

  return { proposals, users, statuses }
};

export default Index;

