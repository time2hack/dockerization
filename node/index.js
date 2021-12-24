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
  destination: function (req, file, cb) { cb(null, './temp'); },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  }
});

const upload = multer({ storage: storage, limits: {
  fileSize: process.env.MAX_SIZE || 10 * 10 * 1024 // 10MB
} });

app.post('/upload', upload.single('video_file'), async function (req, res) {
  console.log(req.file)
  const name = req.file.originalname.replace(/\s/ig, '_')
  const saveTo = path.join(process.cwd(), 'extracts', name);
  try {
    var proc = new ffmpeg(req.file.path);
    return proc.then(video => video.fnExtractFrameToJPG(saveTo, {
        every_n_seconds: 2,
        number : 5,
        file_name : `${name}_%t_%s`
      }))
    .then(files => files.map(n => n.replace(saveTo, `http://localhost:3000/out/${name}`)))
    .then(files => { res.json(files) })
  } catch (e) { console.error(e); }
});

app.get('/', express.static(path.join(__dirname, 'public')));
app.get('/out', express.static(path.join(__dirname, 'exports')));

app.listen(process.env.PORT || 3000, function () {
  console.log('server is ready', process.env.PORT || 3000);
});
