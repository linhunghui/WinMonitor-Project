import axios from "axios";
const API_URL = "http://localhost:8080/api/machine";

class MachineService {
  //新增監控機器
  postMachine(machinename, machinegroup) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL,
      { machinename, machinegroup },
      {
        headers: { Authorization: token },
      }
    );
  }
  //查詢全部機器資訊
  getAllMachines() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL, {
      headers: { Authorization: token },
    });
  }
  //依名稱查詢機器資訊
  getByMachinename(machinename) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/findByMachinename/" + machinename, {
      headers: { Authorization: token },
    });
  }
  //依群組查詢機器資訊
  getByMachinegroup(machinegroup) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/findByMachinegroup/" + machinegroup, {
      headers: { Authorization: token },
    });
  }
  //找ＤＢ所有機器群組
  getAllMachinegroup() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/findAllMachinegroup", {
      headers: { Authorization: token },
    });
  }
  //找ＤＢ所有機器群組
  getNacosMachine(serviceName) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/findNacos/" + serviceName, {
      headers: { Authorization: token },
    });
  }

  //根據學生id去找到他目前註冊的課程有那些
  //資料庫設計方式很多我們這邊用比較笨的方式用學生id去每個課程搜這個學生是否有加入這課程，其實可以user那邊直接設計一欄紀錄學生加入哪個課程id會更快
  // getErolledCourses(_id) {
  //   let token;
  //   if (localStorage.getItem("user")) {
  //     token = JSON.parse(localStorage.getItem("user")).token;
  //   } else {
  //     token = "";
  //   }
  //   return axios.get(API_URL + "/student/" + _id, {
  //     headers: { Authorization: token },
  //   });
  // }

  //用名稱搜尋課程功能
  // getCourseByName(name) {
  //   let token;
  //   if (localStorage.getItem("user")) {
  //     token = JSON.parse(localStorage.getItem("user")).token;
  //   } else {
  //     token = "";
  //   }
  //   return axios.get(API_URL + "/findByName/" + name, {
  //     headers: { Authorization: token },
  //   });
  // }

  //get課程
  // get(_id) {
  //   let token;
  //   if (localStorage.getItem("user")) {
  //     token = JSON.parse(localStorage.getItem("user")).token;
  //   } else {
  //     token = "";
  //   }
  //   return axios.get(API_URL + "/instructor/" + _id, {
  //     headers: { Authorization: token },
  //   });
  // }

  //註冊課程用
  // enroll(_id, user_id) {
  //   let token;
  //   if (localStorage.getItem("user")) {
  //     token = JSON.parse(localStorage.getItem("user")).token;
  //   } else {
  //     token = "";
  //   }
  //   //axios.post(URL,body,header)
  //   return axios.post(
  //     API_URL + "/enroll/" + _id,
  //     { user_id },
  //     {
  //       headers: { Authorization: token },
  //     }
  //   );
  // }
}

export default new MachineService();
