const env = 'product'; // product dev

export const baseUrl = env === 'product' ? 'http://47.98.204.145:8080/suncloud-plus' : 'http://192.168.0.106:7002';
export const imgUrl = env === 'product' ? 'https://api.zfw.tongchealth.com/img' : 'http://192.168.0.106:7002/img';
