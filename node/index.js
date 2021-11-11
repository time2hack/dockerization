/**
 * Code Samples from
 * - https://expressjs.com/en/5x/api.html#req.body
 * - https://www.npmjs.com/package/ffmpeg
 */

const path = require('path')
const multer = require('multer')
const ffmpeg = require('ffmpeg')
const express = require('express')
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('video_file'), function (req, res, next) {
  console.log(req.file)

  try {
    var process = new ffmpeg(req.file.path);
    process.then(function (video) {
      // Callback mode
      video.fnExtractFrameToJPG('./temp', {
        every_n_seconds: 2,
        number : 5,
        file_name : 'my_frame_%t_%s'
      }, function (error, files) {
        error
          ? console.error(error)
          : console.log('Frames: ' + files);
      });
    }, function (err) {
      console.log('Error: ' + err);
    });
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }

});

app.get('/', express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000, function () {
  console.log('server is ready', process.env.PORT || 3000);
});
