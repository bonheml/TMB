import os
import uuid

from preprocessing import generate_spec_from_sound, preprocess_image
from model_interaction import predict
from werkzeug.exceptions import BadRequest


class BirdDetector:
    def __init__(self, audio_model, audio_labels, img_model, img_labels):
        self._input = None
        self._pred_old = None
        self._pred = None
        self._audio_model = audio_model
        self._audio_labels = audio_labels
        self._img_model = img_model
        self._img_labels = img_labels

    def predict(self, payload):
        if 'result' in payload:
            self._pred_old = payload['result']
        self._input = payload['file']
        mimetype = self._input.mimetype.split('/')[0]
        if mimetype == 'image':
            self._classify_image()
        elif mimetype == 'audio':
            self._classify_audio()
        else:
            raise BadRequest('Invalid input file. Expected: audio or image, '
                             'given {}'.format(mimetype))
        if self._pred_old is not None:
            self._calculate_mean()
        return self._pred

    def _classify_image(self):
        fname = "{}.jpeg".format(uuid.uuid4().hex)
        image = preprocess_image(self._input)
        image.save(fname)
        image.close()
        self._pred = predict(fname, self._img_model, self._img_labels)
        os.remove(fname)

    def _classify_audio(self):
        audio_fname = "{}.mp3".format(uuid.uuid4().hex)
        spec_fname = "{}.jpg".format(uuid.uuid4().hex)
        self._input.save(audio_fname)
        spec = generate_spec_from_sound(audio_fname)
        spec.save(spec_fname)
        self._pred = predict(spec_fname, self._audio_model, self._audio_labels)
        os.remove(spec_fname)
        os.remove(audio_fname)

    def _calculate_mean(self):
        pred_old = self._convert_to_dict(self._pred_old)
        pred = self._convert_to_dict(self._pred)
        pred_mean = list()
        for p in pred:
            if p in pred_old:
                pred_mean.append({'species': p,
                                  'score': (pred[p] + pred_old[p]) / 2})
        self._pred = pred_mean
        self._pred_old = None

    def _convert_to_dict(self, pred):
        res_dict = {}
        for entry in pred:
            val = list(entry.values())
            res_dict[val[0]] = val[1]
        return res_dict
