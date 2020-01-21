import React from "react";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import InputQuarkLabels from "../components/input-quark-labels";
import { POST_MUTATION } from "../queries/mutation-quark";
import AddNewQuarkForm from "../components/form-quark";
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
export default AddNewQuark;
