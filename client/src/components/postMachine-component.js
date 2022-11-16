import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MachineService from "../services/machine.service";

function PostMachineComponent(props) {
  let { currentUser, setCurrentUser } = props;
  let [machinename, setMachinename] = useState("");
  let [machinegroup, setMachinegroup] = useState("");
  let [message, setMessage] = useState("");
  const Navigate = useNavigate();
  const handleTakeToLogin = () => {
    Navigate("/login");
  };
  const handleChangeMachinename = (e) => {
    setMachinename(e.target.value);
  };
  const handleChangeMachinegroup = (e) => {
    setMachinegroup(e.target.value);
  };

  const postMachine = () => {
    MachineService.postMachine(machinename, machinegroup)
      .then((response) => {
        window.alert("New Machine has been added.");
        Navigate("/monitor");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before posting a new course.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "admin" && (
        <div>
          <p>Only admin can add new machine.</p>
        </div>
      )}
      {currentUser && currentUser.user.role == "admin" && (
        <div className="form-group">
          <label for="exampleforTitle">機器名稱</label>
          <input
            name="machinename"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeMachinename}
          />
          <br />
          <label for="exampleforTitle">機器群組</label>
          <input
            name="machinegroup"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeMachinegroup}
          />
          <br />

          <button className="btn btn-primary" onClick={postMachine}>
            Submit
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostMachineComponent;
