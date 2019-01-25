import os
import uuid

from preprocessing import generate_spec_from_sound, preprocess_image
from werkzeug.exceptions import BadRequest

TEST_OUTPUT = [{'species': 'Corvus corvus', 'score': 0.9},
               {'species': 'Anthus trivialis', 'score': 0.8},
               {'species': 'Motacilla flava', 'score': 0.7},
               {'species': 'Linaria cannabina', 'score': 0.6},
               {'species': 'Carpodacus erythrinus', 'score': 0.5},
               {'species': 'Acrocephalus palustris', 'score': 0.4},
               {'species': 'Larus fuscus', 'score': 0.3},
               {'species': 'Porzana porzana', 'score': 0.2},
               {'species': 'Crex crex', 'score': 0.12},
               {'species': 'Pyrrhula pyrrhula', 'score': 0.1}]


class BirdDetector:
    def __init__(self):
        self._input = None
        self._pred_old = None
        self._pred = None

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
        image = preprocess_image(self._input)
        # TODO: add model predictions to replace current result
        self._pred = TEST_OUTPUT

    def _classify_audio(self):
        fname = "{}.mp3".format(uuid.uuid4().hex)
        self._input.save(fname)
        spec = generate_spec_from_sound(fname)
        spec.save('spec_created.png')
        os.remove(fname)
        # TODO : add model predictions to replace current result
        self._pred = TEST_OUTPUT


    def _calculate_mean(self):
        pred_old = self._convert_to_dict(self._pred_old)
        pred = self._convert_to_dict(self._pred)
        pred_mean = list()
        for p in pred:
            if p in pred_old:
                pred_mean.append({'species': p ,
                                  'score': (pred[p] + pred_old[p]) / 2 })
        self._pred = pred_mean
        self._pred_old = None


    def _convert_to_dict(self, pred):
        res_dict = {}
        for entry in pred:
            val = list(entry.values())
            res_dict[val[0]] = val[1]
        return res_dict