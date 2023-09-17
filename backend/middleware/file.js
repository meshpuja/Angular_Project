const multer = require('multer')
const mimeType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/jpg': 'jpg'
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //console.log('Pooja')
      console.log(file.mimetype)
      const isValid = mimeType[file.mimetype]
      let error = new Error('This is not a valid')
      if (isValid) { error = null }
      cb(error, "backend/images")
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-')
      const ext = mimeType[file.mimetype]
      cb(null, name + '-' + Date.now() + '.' + ext)
    }
  })
  module.exports = multer({ storage: storage }).single('image')