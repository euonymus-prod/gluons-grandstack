import React from "react";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { withFirebase } from "../providers/firebase";
import { withAuthUser } from "../providers/session";
import { Mutation } from "react-apollo";
import { Query } from "react-apollo";
import InputQuarkLabels from "../components/input-quark-labels";
import EditingQuark from "../queries/query-editing-quark";

import { POST_MUTATION } from "../queries/mutation-quark";
import Util from "../utils/common";
import { convertTableForTemporallyUse } from "../utils/auth-util";

// Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const QUARKS_PER_PAGE = 20;
// TODO
const QUARKS_QUERY = "";
const EditQuark = props => {
  const { authUser } = props;
  const user_id = convertTableForTemporallyUse[authUser.uid];
  const EDITING_QUARK = new EditingQuark(user_id);
  const variables = {
    id: props.match.params.quark_id
  };
  return (
    <Query query={EDITING_QUARK} variables={variables}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const { editingQuark } = data;
        return (
          <div className="EditQuark">
            <h1>Edit Quark</h1>
            <EditQuarkForm editingQuark={editingQuark} />
          </div>
        );
      }}
    </Query>
  );
};

const INITIAL_STATE = {
  error: null,
  name: "",
  image_path: "",
  description: "",
  start: "",
  end: "",
  start_accuracy: "",
  end_accuracy: "",
  is_momentary: false,
  url: "",
  affiliate: "",
  is_private: false,
  is_exclusive: true,
  quark_type_id: ""
};

class EditQuarkFormBase extends React.Component {
  state = { ...INITIAL_STATE };
  componentDidMount() {
    const { editingQuark } = this.props;
    if (editingQuark) {
      const util = new Util();
      const start = util.date2str({
        ...editingQuark.start,
        month: editingQuark.start.month - 1
      });
      const end = util.date2str({
        ...editingQuark.end,
        month: editingQuark.end.month - 1
      });
      this.setState({ ...editingQuark, start, end, quark_type_id: 2 });
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: !this.state[event.target.name] });
  };

  render() {
    const {
      error,
      name,
      image_path,
      description,
      start,
      end,
      start_accuracy,
      end_accuracy,
      is_momentary,
      url,
      affiliate,
      is_private,
      is_exclusive,
      quark_type_id
    } = this.state;

    const isInvalid = name === "";

    return (
      <div>
        <div className="container">
          <fieldset>
            <legend>Edit Quark</legend>
            <div className="form-group">
              <label>Name</label>
              <input
                value={name}
                name="name"
                onChange={this.onChange}
                type="text"
                placeholder="Name"
                className="form-control"
              />
              <label>Image Path</label>
              <input
                value={image_path}
                name="image_path"
                onChange={this.onChange}
                type="text"
                placeholder="Image Path"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <h4>optional</h4>
              <label>Description</label>
              <input
                value={description}
                name="description"
                onChange={this.onChange}
                type="text"
                placeholder="Description"
                className="form-control"
              />
              <label>Start</label>
              <input
                value={start}
                name="start"
                onChange={this.onChange}
                type="date"
                className="form-control date"
              />
              <label>End</label>
              <input
                value={end}
                name="end"
                onChange={this.onChange}
                type="date"
                className="form-control date"
              />
              <label>Start Accuracy</label>
              <input
                value={start_accuracy}
                name="start_accuracy"
                onChange={this.onChange}
                type="text"
                placeholder="Start Accuracy"
                className="form-control"
              />
              <label>End Accuracy</label>
              <input
                value={end_accuracy}
                name="end_accuracy"
                onChange={this.onChange}
                type="text"
                placeholder="End Accuracy"
                className="form-control"
              />
              <div className="input checkbox">
                <label htmlFor="is-momentary">
                  <input
                    name="is_momentary"
                    onChange={this.onChangeCheckbox}
                    type="checkbox"
                    checked={is_momentary}
                  />
                  Is Momentary
                </label>
              </div>

              <label>URL</label>
              <input
                value={url}
                name="url"
                onChange={this.onChange}
                type="text"
                placeholder="URL"
                className="form-control"
              />
              <label>Affiliate</label>
              <input
                value={affiliate}
                name="affiliate"
                onChange={this.onChange}
                type="text"
                placeholder="Affiliate URL"
                className="form-control"
              />
              <br />
              <label>Quark Type</label>
              <InputQuarkLabels
                onChange={quark_type_id => this.setState({ quark_type_id })}
                defaultValue={quark_type_id}
              />
              <div className="input checkbox">
                <label htmlFor="is-private">
                  <input
                    name="is_private"
                    onChange={this.onChangeCheckbox}
                    type="checkbox"
                    checked={is_private}
                  />
                  Is Private
                </label>
              </div>
              <div className="input checkbox">
                <label htmlFor="is-exclusive">
                  <input
                    name="is_exclusive"
                    onChange={this.onChangeCheckbox}
                    type="checkbox"
                    checked={is_exclusive}
                  />
                  Is Exclusive
                </label>
              </div>
            </div>
          </fieldset>

          <Mutation
            mutation={POST_MUTATION}
            variables={{
              name,
              image_path,
              description,
              start: { formatted: start },
              end: { formatted: end },
              start_accuracy,
              end_accuracy,
              is_momentary,
              url,
              affiliate,
              is_private,
              is_exclusive,
              quark_type_id: Number(quark_type_id)
            }}
            onCompleted={data =>
              this.props.history.push(`/graph/${data.CreateQuark.name}`)
            }
            update={(store, { data: { CreateQuark } }) => {
              const first = QUARKS_PER_PAGE;
              const skip = 0;
              const orderBy = "created";

              // Note: you need try catch, so error doesn't happen even if QUARKS_QUERY is not yet provided.
              try {
                const data = store.readQuery({
                  query: QUARKS_QUERY,
                  variables: { first, skip, orderBy }
                });
                data.quarks.unshift(CreateQuark);
                store.writeQuery({
                  query: QUARKS_QUERY,
                  data,
                  variables: { first, skip, orderBy }
                });
              } catch (e) {} // eslint-disable-line
            }}
          >
            {postMutation => (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!this.state.name) {
                    alert("Name is required");
                    return false;
                  }
                  postMutation();
                }}
              >
                Submit
              </button>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}
export default withAuthUser(EditQuark);

const EditQuarkForm = withRouter(
  withFirebase(withLastLocation(EditQuarkFormBase))
);
export { EditQuarkForm };
