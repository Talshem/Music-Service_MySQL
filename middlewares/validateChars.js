let validateChars =  (req, res, next) => {
let body = req.body
let params = req.params
function validate(param) {
   if (/^[a-zA-Z0-9_]+$/.test(param))
  {
    return (true)
  }
    return (false)
}
for (const [key, value] of Object.entries(body)) {
if(!validate(value)) {
return res.json({ message: 'Only digits and letters are allowed' });
}
}
for (const [key, value] of Object.entries(params)) {
if(!validate(value)) {
return res.json({ message: 'Parameter can only contain digits and letters are allowed' });
}
}
next();
}

  module.exports = validateChars