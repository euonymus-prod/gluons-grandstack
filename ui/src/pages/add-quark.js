import React from "react";
import QuarkForm from "../components/form-quark";
import LoggedinOnly from "../components/loggedin_only";

const AddNewQuark = () => (
  <LoggedinOnly>
    <div className="AddNewQuark">
      <h1>Add New Quark</h1>
      <QuarkForm />
    </div>
  </LoggedinOnly>
);
export default AddNewQuark;
