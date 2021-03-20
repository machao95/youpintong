const env = 'product'; // product dev

export const baseUrl = env === 'product' ? 'https://api.zfw.tongchealth.com' : 'http://192.168.0.106:7002';
export const imgUrl = env === 'product' ? 'https://api.zfw.tongchealth.com/img' : 'http://192.168.0.106:7002/img';
