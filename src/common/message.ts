import axios from "axios";
import logger from "./logger";
import fs from "fs";
import path from "path";

// 读取pushkey文件
let pushkeyTxt = "";
if (fs.existsSync("./config/pushkey.txt")) {
  pushkeyTxt = fs.readFileSync("/app/config/pushkey.txt").toString();
}
const sendKey = process.env["SERVERPUSHKEY"] || pushkeyTxt.trim() || "";

async function sendMessage() {
  const url = `http://iyuu.cn/${sendKey}.send`;
  const data = {
    text: "斗鱼荧光棒-完成",
    desp: fs.readFileSync(path.join(__dirname, "..", "..", "douyu.log"), "utf-8")
  };
  if (data.desp && data.desp.indexOf("[ERROR]") != -1) {
    logger.info("------执行推送------");
    await axios({
      method: "post",
      url,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    logger.info("------推送成功------");
  } else {
    let errors = []
    data.desp.split(/\r?\n/).forEach(line =>  {
      if (line.indexOf("[ERROR]") != -1) errors.push(line)
    });
    await axios({
      method: "post",
      url,
      data: {
        text: "斗鱼荧光棒-错误",
        desp: errors.join("\n")
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }
}

export default sendMessage;
