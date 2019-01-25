import json
import os
from pathlib import Path

import pytest
from app import app
from requests_toolbelt import MultipartEncoder

test_app = app.test_client()
print(os.getcwd())


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

curr_path = Path(__file__).parent
sound_path = curr_path / 'test.mp3'
img_path = curr_path / 'test.png'

testdata = [MultipartEncoder(fields={'file': ('test.png',
                                              open(img_path, 'rb'),
                                              'image/png')}),
            MultipartEncoder(fields={'file': ('test.mp3',
                                              open(sound_path, 'rb'),
                                              'audio/mp3')}),
            MultipartEncoder(fields={'file': ('test.png',
                                              open(img_path, 'rb'),
                                              'image/png'),
                                     'result': json.dumps(TEST_OUTPUT)}),
            MultipartEncoder(fields={'file': ('test.mp3',
                                              open(sound_path, 'rb'),
                                              'audio/mp3'),
                                     'result': json.dumps(TEST_OUTPUT)})
            ]


@pytest.mark.parametrize("data", testdata)
def test_home(data):
    result = test_app.post('/bird_detection', data=data,
                           headers={'Content-Type': data.content_type})
    assert result.status_code == 200
    assert json.loads(result.data)['result'] == TEST_OUTPUT

