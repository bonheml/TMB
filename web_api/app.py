#!flask/bin/python
import json

from bird_detection import BirdDetector
from cerberus import Validator
from flask import Flask
from flask_restplus import Api, fields, Resource
from pathlib import Path
from werkzeug.datastructures import FileStorage

app = Flask(__name__)
api = Api(app, version='1.0', title="That's my bird", validate=True,
          description="An API providing bird recognition from song and/or "
                      "captions using machine learning.")

root_model_path = Path(__file__).parent / 'model'
audio_model_path = str(root_model_path / 'audio_graph.pb')
audio_labels_path = str(root_model_path / 'audio_labels.txt')
img_model_path = str(root_model_path / 'img_graph.pb')
img_labels_path = str(root_model_path / 'img_labels.txt')


result_fields = api.model('result', {
    'species': fields.String,
    'score': fields.Float
})

output = api.model('response', {
    'result': fields.List(fields.Nested(result_fields), required=True)
})


def result_validator(value):
    result_schema = {
        'species': {'required': True, 'type': 'string'},
        'score': {'required': True, 'type': 'float', 'min': 0.0, 'max': 1.0}
    }
    values = json.loads(value)
    validator = Validator(result_schema)
    for v in values:
        if not validator.validate(v):
            raise ValueError(json.dumps(validator.errors))
    return values


parser = api.parser()
parser.add_argument('file', location='files', type=FileStorage, required=True)
parser.add_argument('result', location='form', type=result_validator,
                    required=False)


@api.route('/bird_detection')
class BirdDetection(Resource):
    ''' Detect bird from audio recording or caption'''
    @api.doc('detect_bird')
    @api.expect(parser)
    @api.marshal_with(output, code=201)
    def post(self):
        ''' Receive recording or caption to detect bird'''
        detector = BirdDetector(audio_model_path, audio_labels_path, img_model_path, img_labels_path)
        args = parser.parse_args()
        res = detector.predict(args)
        return {'result': res}


if __name__ == '__main__':
    app.run(debug=True)
