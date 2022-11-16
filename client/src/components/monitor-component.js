import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MachineService from "../services/machine.service.js";

function MonitorComponent(props) {
  let { currentUser, setCurrentUser } = props;
  let [searchMachinegroupData, setSearchMachinegroupData] = useState(null);
  let [nacosAliveMachine, setNacosAliveMachine] = useState(null);
  const Navigate = useNavigate();
  const handleTakeLogin = () => {
    Navigate("/login");
  };
  const handleMachinegroup = (e) => {
    setSearchMachinegroupData(e.target.id);
    //這裡會是前一次的searchMachinegroupData
    //console.log(searchMachinegroupData);
  };
  // 按下按鈕後去抓nacos資料 有bug因為NacosAliveMachine不會歸零要改
  if (searchMachinegroupData != null) {
    MachineService.getNacosMachine(searchMachinegroupData)
      .then((data) => {
        setNacosAliveMachine(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //不設定會因為有值一直打
    setSearchMachinegroupData(null);
  }

  //用來放從API獲得的data，且ㄧ登入就要先去抓一次
  let [mongoMachinegroupData, setMongoMachinegroupData] = useState(null);
  useEffect(() => {
    console.log("Using effect.");
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
    }

    //登入後可以看
    if (currentUser) {
      //用MachineService去後端抓所有群組資料並存到mongoMachinegroupData
      MachineService.getAllMachinegroup()
        .then((data) => {
          setMongoMachinegroupData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  //每秒刷新
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("This will run every second!");
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {/* 沒登入的話 */}
      {!currentUser && (
        <div>
          <p>You must login before seeing your courses</p>
          <button onClick={handleTakeLogin} className="btn btn-primary btn-lg">
            Take me to login page.
          </button>
        </div>
      )}
      {/* 登入後先把db的東西找出來做成按鍵 */}
      {currentUser && mongoMachinegroupData && (
        <div class="btn-group" role="group" aria-label="Basic example">
          {mongoMachinegroupData.map((group) => (
            <button
              type="button"
              onClick={handleMachinegroup}
              id={group}
              class="btn btn-primary"
            >
              {group}
            </button>
          ))}
        </div>
      )}
      {/* 按下群組後根據nacos貼出照片 */}
      {currentUser && nacosAliveMachine && (
        <div className="pictures">
          {nacosAliveMachine.map((d) => (
            <div className="picture">
              <h5>機器名： {d.metadata.machine_name}</h5>
              <div className="imageContainer">
                <img src={d.metadata.imgUrl} alt="" />
              </div>
              <p>
                點我放大:{" "}
                <a target="_blank" href={d.metadata.imgUrl}>
                  Click Here
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MonitorComponent;
