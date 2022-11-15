import mongoose from "mongoose";

const MachineSchema = new mongoose.Schema({
  machinename: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  machinegroup: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
});

const Machine = mongoose.model("Machine", MachineSchema);
export default Machine;
