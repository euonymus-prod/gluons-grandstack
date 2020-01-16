import React from "react";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { withFirebase } from "../providers/firebase";
import { Mutation } from "react-apollo";
import InputQuarkLabels from "../components/input-quark-labels";
import { POST_MUTATION } from "../queries/quark-fields";

// Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const QUARKS_PER_PAGE = 20;
// TODO
const QUARKS_QUERY = "";
const AddNewQuark = () => (
  <div className="AddNewQuark">
    <h1>Add New Quark</h1>
    <AddNewQuarkForm />
  </div>
);

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
  quark_type_id: "",
  auto_fill: true
};

class AddNewQuarkFormBase extends React.Component {
  state = { ...INITIAL_STATE };

  // onSubmit = event => {
  //   const { email, password } = this.state;
  //
  //   // this.props.firebase
  //   //   .doSignInWithEmailAndPassword(email, password)
  //   //   .then(() => {
  //   //     this.setState({ ...INITIAL_STATE });
  //   //     const { lastLocation } = this.props;
  //   //     let redirectLocation = "/";
  //   //     if (
  //   //       lastLocation &&
  //   //       lastLocation.pathname !== "/signup" &&
  //   //       lastLocation.pathname !== "/login"
  //   //     ) {
  //   //       redirectLocation = lastLocation;
  //   //     }
  //   //     this.props.history.push(redirectLocation);
  //   //   })
  //   //   .catch(error => {
  //   //     this.setState({ error });
  //   //   });
  //
  //   event.preventDefault();
  // };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
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
      quark_type_id,
      auto_fill
    } = this.state;

    const isInvalid = name === "";

    return (
      <div>
        <div className="container">
          <fieldset>
            <legend>Add New Quark</legend>
            <div className="form-group">
              <label>Name</label>
              <input
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
                type="text"
                placeholder="Name"
                className="form-control"
              />
              <label>Image Path</label>
              <input
                value={image_path}
                onChange={e => this.setState({ image_path: e.target.value })}
                type="text"
                placeholder="Image Path"
                className="form-control"
              />
              <div className="input checkbox">
                <label htmlFor="is-exclusive">
                  <input
                    onChange={e => this.setState({ auto_fill: !auto_fill })}
                    type="checkbox"
                    checked={auto_fill}
                  />
                  Auto Fill
                </label>
              </div>
            </div>
            <div className="form-group">
              <h4>optional</h4>
              <label>Description</label>
              <input
                value={description}
                onChange={e => this.setState({ description: e.target.value })}
                type="text"
                placeholder="Description"
                className="form-control"
              />
              <label>Start</label>
              <input
                value={start}
                onChange={e => this.setState({ start: e.target.value })}
                type="date"
                className="form-control date"
              />
              <label>End</label>
              <input
                value={end}
                onChange={e => this.setState({ end: e.target.value })}
                type="date"
                className="form-control date"
              />
              <label>Start Accuracy</label>
              <input
                value={start_accuracy}
                onChange={e =>
                  this.setState({ start_accuracy: e.target.value })
                }
                type="text"
                placeholder="Start Accuracy"
                className="form-control"
              />
              <label>End Accuracy</label>
              <input
                value={end_accuracy}
                onChange={e => this.setState({ end_accuracy: e.target.value })}
                type="text"
                placeholder="End Accuracy"
                className="form-control"
              />
              <div className="input checkbox">
                <label htmlFor="is-momentary">
                  <input
                    onChange={e =>
                      this.setState({ is_momentary: !is_momentary })
                    }
                    type="checkbox"
                    checked={is_momentary}
                  />
                  Is Momentary
                </label>
              </div>

              <label>URL</label>
              <input
                value={url}
                onChange={e => this.setState({ url: e.target.value })}
                type="text"
                placeholder="URL"
                className="form-control"
              />
              <label>Affiliate</label>
              <input
                value={affiliate}
                onChange={e => this.setState({ affiliate: e.target.value })}
                type="text"
                placeholder="Affiliate URL"
                className="form-control"
              />
              <br />
              <label>Quark Type</label>
              <InputQuarkLabels
                onChange={quark_type_id => this.setState({ quark_type_id })}
              />
              <div className="input checkbox">
                <label htmlFor="is-private">
                  <input
                    onChange={e => this.setState({ is_private: !is_private })}
                    type="checkbox"
                    checked={is_private}
                  />
                  Is Private
                </label>
              </div>
              <div className="input checkbox">
                <label htmlFor="is-exclusive">
                  <input
                    onChange={e =>
                      this.setState({ is_exclusive: !is_exclusive })
                    }
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
              start,
              end,
              start_accuracy,
              end_accuracy,
              is_momentary,
              url,
              affiliate,
              is_private,
              is_exclusive,
              quark_type_id,
              auto_fill
            }}
            onCompleted={data =>
              this.props.history.push(`/${data.createQuark.name}`)
            }
            update={(store, { data: { createQuark } }) => {
              const first = QUARKS_PER_PAGE;
              const skip = 0;
              const orderBy = "created_at";

              // Note: you need try catch, so error doesn't happen even if QUARKS_QUERY is not yet provided.
              try {
                const data = store.readQuery({
                  query: QUARKS_QUERY,
                  variables: { first, skip, orderBy }
                });
                data.quarks.unshift(createQuark);
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
export default AddNewQuark;

const AddNewQuarkForm = withRouter(
  withFirebase(withLastLocation(AddNewQuarkFormBase))
);
export { AddNewQuarkForm };
