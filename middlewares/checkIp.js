let checkIp =  (req, res, next) => {
let ips = ['::ffff:127.0.0.1']
for (let ip of ips){
if (req.ip !== ip) {
return res.status(403).end('forbidden');
}}
next();
};

module.exports = checkIp