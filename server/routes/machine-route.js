// 待改進
// 1.可以重複輸入相同機器名（檢查機制看客戶需求）
// 2.刪除機器/更新機器時遇到同機器名會找第一個找到的刪（可改用_id來當刪除依據）
import express from "express";
const router = express.Router();
import { machineValidation } from "../validation.js";
import { Machine } from "../models/index.js";

router.use((req, res, next) => {
  console.log("A request is comming into api");
  next();
});

//獲得所有機器資訓
router.get("/", (req, res) => {
  //v2:要寫
  //populate <  creator: {type: mongoose.Schema.Types.ObjectId,ref: "User",}
  //objectid跟User是互相連接的所以每筆machine的資料一定會有他creator的資料
  //populate(搜索"creator",[要產出的資料有哪些"username","email"])
  Machine.find({})
    .populate("machinename", ["machinename", "machinegroup"])
    .then((machines) => {
      res.send(machines);
    })
    .catch(() => {
      res.status(500).send("Error Cannot get course!!");
    });
});

// router.get("/instructor/:_instructor_id", (req, res) => {
//   let { _instructor_id } = req.params;
//   Course.find({ instructor: _instructor_id })
//     .populate("instructor", ["username", "email"])
//     .then((data) => {
//       res.send(data);
//     })
//     .catch(() => {
//       res.status(500).send("Cannot get data");
//     });
// });

//用機器名搜尋(看機器是哪個群組)
router.get("/findByMachinename/:machinename", (req, res) => {
  let { machinename } = req.params;
  Machine.find({ machinename })
    .populate("machinename", ["machinename", "machinegroup"])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send("Cannot get data");
    });
});

//用機器群組搜尋(看群組有哪些機器)
router.get("/findByMachinegroup/:machinegroup", (req, res) => {
  let { machinegroup } = req.params;
  Machine.find({ machinegroup })
    .populate("machinegroup", ["machinename", "machinegroup"])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send("Cannot get data");
    });
});

//新增機器
router.post("/", async (req, res) => {
  //validate the inputs before making a new course
  const { error } = machineValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { machinename, machinegroup } = req.body;
  //passport當中會有user可以用
  if (req.user.isReadonly()) {
    return res.status(400).send("Only admin can add a new machine.");
  }

  let newMachine = new Machine({
    machinename,
    machinegroup,
  });
  try {
    await newMachine.save();
    res.status(200).send("New machine has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save machine.");
  }
});

//更新機器資訊
router.patch("/:machinename", async (req, res) => {
  //validate the inputs before making a new machine
  const { error } = machineValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { machinename } = req.params;
  let machine = await Machine.findOne({ machinename });
  if (!machine) {
    res.status(404);
    return res.json({ success: false, message: "Machine not found." });
  }
  if (req.user.isAdmin()) {
    Machine.findOneAndUpdate({ machinename }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Machine updated.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only the admin can edit this machine",
    });
  }
});
//刪除機器
router.delete("/:machinename", async (req, res) => {
  let { machinename } = req.params;
  let machine = await Machine.findOne({ machinename });
  if (!machine) {
    res.status(404);
    return res.json({ success: false, message: "Machine not found." });
  }
  if (req.user.isAdmin()) {
    Machine.deleteOne({ machinename })
      .then(() => {
        res.send("Machine deleted.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only admin can delete this machine",
    });
  }
});

//找表內有哪些部不同群組
router.get("/findAllMachinegroup", (req, res) => {
  Machine.distinct("machinegroup")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
