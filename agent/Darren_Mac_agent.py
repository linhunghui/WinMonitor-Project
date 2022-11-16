import requests
import json
import time
from multiprocessing import Pool
import logging
import boto3
from botocore.exceptions import ClientError
import os
import pyscreenshot as ImageGrab
import time


def screenshot_and_uploadtoS3(machine_name, s3_ak, s3_sk, s3_bucket):
    pwd = os.getcwd()
    while (True):
        img = ImageGrab.grab()
        imgConvernt = img.convert('RGB')
        filename = f"{pwd}/{machine_name}/{machine_name}.jpg"
        imgConvernt.save(filename, quality=50)
        s3_client = boto3.client(
            's3', aws_access_key_id=s3_ak, aws_secret_access_key=s3_sk)
        # s3filename=f"{machine_name}/{machine_name}_{time.strftime('%Y-%m-%d_%H-%M-%S')}.jpg"
        s3filename = f"{machine_name}/{machine_name}.jpg"

        # Upload the file
        try:
            response = s3_client.upload_file(filename, s3_bucket, s3filename,ExtraArgs={ "ContentType": "image/jpeg"})
            print(f"{filename}upload s3 successfully")
            os.remove(filename)
            time.sleep(60)
            continue
        except ClientError as e:
            logging.error(e)
            return False


def create_machineDir(machine_name):
    # pwd
    pwd = os.getcwd()
    # mkdir
    os.makedirs(pwd+"/"+machine_name, exist_ok=True)

# nacos function


def get_ip():
    ip = requests.get('https://api.ipify.org').text
    return ip


def asyncInstanceBeat(accessToken, machine_name):
    # 持续发送心跳
    while (True):
        metadata = {"machine_name": machine_name,"imgUrl":f"https://jackass55688.s3.ap-northeast-1.amazonaws.com/{machine_name}/{machine_name}.jpg"}
        beatDict = {"cluster": "DEFAULT", "ip": get_ip(), "metadata": metadata, "port": 26402,
                    "scheduled": True, "serviceName": "dc1", "weight": 1}
        instanceBeatData = {'serviceName': 'dc1', 'groupName': 'DEFAULT_GROUP', 'ephemeral': True,
                            'accessToken': accessToken, 'beat': json.dumps(beatDict)}
        instanceBeatUrl = "http://52.197.215.123:8848/nacos/v1/ns/instance/beat"
        instanceBeatResponse = requests.put(instanceBeatUrl, instanceBeatData)
        print("instanceBeatResponse: " + instanceBeatResponse.text)
        time.sleep(5)


def registerServerToNacos():
    # 登录nacos获取accessToken
    loginUrl = "http://52.197.215.123:8848/nacos/v1/auth/users/login"
    loginData = {'username': 'nacos',
                 'password': 'nacos', 'namespace': 'public'}
    loginResponse = requests.post(loginUrl, data=loginData)
    accessToken = dict(json.loads(loginResponse.text)).get("accessToken")
    print("accessToken: " + accessToken)

    # 注册实例
    # metadata={"register":"success"}

    #registerInstanceUrl = "http://52.197.215.123:8848/nacos/v1/ns/instance"
    # registerInstanceData={'serviceName':'win-monitor-agent', 'ip':get_ip(),'port':26400,'metadata':json.dumps(metadata),
    #                       'clusterName':'DEFAULT', 'weight':1, 'enable':True, 'healthy':True,
    #                       'ephemeral':True, 'groupName':'DEFAULT_GROUP',
    #                       'accessToken':accessToken}

    # registerInstanceResponse = requests.post(registerInstanceUrl, registerInstanceData)
    # print("registerInstance:" + registerInstanceResponse.text)
    threadPool.apply_async(asyncInstanceBeat, args=(accessToken, machine_name))
    threadPool.apply_async(screenshot_and_uploadtoS3, args=(
        machine_name, s3_ak, s3_sk, s3_bucket))


if __name__ == '__main__':
    # 變數設定
    # s3_ak=input("please enter your s3 access key : ")
    # s3_sk=input("please enter your s3 secret key : ")
    # s3_bucket=input("please enter your s3 bucketname : ")
    s3_ak = "AKIAWDLGM52VIN4MTTE6"
    s3_sk = "vz3oKo2JXadGtfp7i/F3TSKwKvZcgYUrh3hbLRdo"
    s3_bucket = "jackass55688"
    machine_name = input(
        "please enter your Machine_Name(this will be your s3 dirname) : ")
    create_machineDir(machine_name)

    # nacos 服務報到
    threadPool = Pool(2)
    registerServerToNacos()
    threadPool.close()
    threadPool.join()
# 把上傳資料寫到metadata
