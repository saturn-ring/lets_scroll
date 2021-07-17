const axios = require("axios");
const crypto = new (require("node-jsencrypt"))();

crypto.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA81dCnCKt0NVH7j5Oh2+SGgEU0aqi5u6sYXemouJWXOlZO3jqDsHYM1qfEjVvCOmeoMNFXYSXdNhflU7mjWP8jWUmkYIQ8o3FGqMzsMTNxr+bAp0cULWu9eYmycjJwWIxxB7vUwvpEUNicgW7v5nCwmF5HS33Hmn7yDzcfjfBs99K5xJEppHG0qc+q3YXxxPpwZNIRFn0Wtxt0Muh1U8avvWyw03uQ/wMBnzhwUC8T4G5NclLEWzOQExbQ4oDlZBv8BM/WxxuOyu0I8bDUDdutJOfREYRZBlazFHvRKNNQQD2qDfjRz484uFs7b5nykjaMB9k/EJAuHjJzGs9MMMWtQIDAQAB");

const region = {
    "서울": "https://senhcs.eduro.go.kr",
    "부산": "https://penhcs.eduro.go.kr",
    "대구": "https://dgehcs.eduro.go.kr",
    "인천": "https://icehcs.eduro.go.kr",
    "광주": "https://genhcs.eduro.go.kr",
    "대전": "https://djehcs.eduro.go.kr",
    "울산": "https://usehcs.eduro.go.kr",
    "세종": "https://sjehcs.eduro.go.kr",
    "경기": "https://goehcs.eduro.go.kr",
    "강원": "https://kwehcs.eduro.go.kr",
    "충북": "https://cbehcs.eduro.go.kr",
    "충남": "https://cnehcs.eduro.go.kr",
    "전북": "https://jbehcs.eduro.go.kr",
    "전남": "https://jnehcs.eduro.go.kr",
    "경북": "https://gbehcs.eduro.go.kr",
    "경남": "https://gnehcs.eduro.go.kr",
    "제주": "https://jjehcs.eduro.go.kr",
    "path": [
        "/v2/findUser",
        "/v2/validatePassword",
        "/v2/selectUserGroup",
        "/registerServey"
    ]
};

async function find(name) {
    let url = "http://hcs.eduro.go.kr/v2/searchSchool?orgName";
    let { data } = await axios.get(`${url}=${encodeURI(name)}`);
    return data.schulList[0].orgCode;
}

async function getToken(json) {
    let url = region[json.area] + region.path[0];
    let { data } = await axios.post(url, {
        "orgCode": await find(json.school),
        "name": crypto.encrypt(json.name),
        "birthday": crypto.encrypt(json.birth),
        "loginType": "school"
    });
    return data.token;
}

async function getToken2(json) {
    let url = region[json.area] + region.path[1];
    let token = await getToken(json);
    let pass = crypto.encrypt(json.pass);
    let { data } = await axios({
        "method": "POST",
        "url": url,
        "data": { "password": pass },
        "headers": { "Authorization": token }
    })
    return data;
}

async function getToken3(json) {
    let url = region[json.area] + region.path[2];
    let token = await getToken2(json);
    let { data } = await axios({
        "method": "POST",
        "url": url,
        "headers": { "Authorization": token }
    })
    return data[0].token;
}

module.exports = async function(json) {
    let url = region[json.area] + region.path[3];
    let token = await getToken3(json);
    let { data } = await axios({
        "method": "POST",
        "url": url,
        "data": {
            "rspns01": "1",
            "rspns02": "1",
            "rspns00": "Y",
            "upperToken": token,
            "upperUserNameEncpt": "DAMI"
        },
        "headers": { "Authorization": token }
    })
    return data;
}
