var express = require('express');
var router = express.Router();
var path = require('path')
var sharp = require('sharp')
var fs = require('fs')
var FormData = require('form-data')
var fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*UPLOAD AN IMAGE */
router.put('/image-upload', function(req, res, next) {
  if (!req.files)
    return res.status(400).json({message: 'No files were uploaded.'});
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleImage = req.files.sampleImage;
  console.log("source length:" + sampleImage.data.length)
  sharp(sampleImage.data)
  .resize(32, 32)
  .background({r: 0, g: 0, b: 0, alpha: 1})
  .embed()
  .toFormat('png')
  .toBuffer(function(err, outputBuffer) {
    if (err) {
      return res.status(500).json({error: err});
    }
    const savePathPub = `/images/${sampleImage.name.replace(' ','').split('.')[0]}.png`
    const savePath = path.join(process.env.PWD, '/public', savePathPub)
    
    // Use the mv() method to place the file somewhere on your server
    fs.writeFile(savePath, outputBuffer, function(err) {
        if (err) return res.status(500).json(err);
        
        //here we need to ask our CNN to recognize the image
        const formData = new FormData()
        //console.log(this.state.picture)
        formData.append('sampleImage', fs.createReadStream(savePath))
        fetch('http://35.199.166.194:8082/upload', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .catch(error => res.status(500).json(error))
        .then(response => {
            const envelop = {
              predictions: response,
              originalImage: savePathPub
            }
            res.json(envelop)
        });
    })
  })
});


module.exports = router;
