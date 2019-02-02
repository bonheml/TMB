import json
import os
from pathlib import Path

import pytest
from app import app
from requests_toolbelt import MultipartEncoder

test_app = app.test_client()
print(os.getcwd())


TEST_OUTPUT = [{'species': 'crex crex', 'score': 0.9},
               {'species': 'anthus trivialis', 'score': 0.8},
               {'species': 'corvus corax', 'score': 0.7},
               {'species': 'linaria cannabina', 'score': 0.6},
               {'species': 'carpodacus erythrinus', 'score': 0.5},
               {'species': 'acrocephalus palustris', 'score': 0.4},
               {'species': 'larus fuscus', 'score': 0.3},
               {'species': 'porzana porzana', 'score': 0.2},
               {'species': 'tadorna tadorna', 'score': 0.12},
               {'species': 'riparia riparia', 'score': 0.1}]

res1 = ['apus apus', 'pica pica', 'coturnix coturnix', 'crex crex', 'corvus corax', 'branta canadensis', 'tyto alba',
        'sturnus vulgaris', 'tadorna tadorna', 'riparia riparia']

res2 = ['anthus trivialis', 'sitta europaea', 'regulus regulus', 'periparus ater', 'prunella modularis',
        'corvus cornix', 'parus major', 'turdus viscivorus', 'luscinia svecica', 'phoenicurus phoenicurus']

res3 = ['crex crex', 'corvus corax', 'tadorna tadorna', 'riparia riparia']

res4 = ['anthus trivialis']

curr_path = Path(__file__).parent
sound_path = str(curr_path / 'test.mp3')
img_path = str(curr_path / 'test.png')

testdata = [(MultipartEncoder(fields={'file': ('test.png',
                                              open(img_path, 'rb'),
                                              'image/png')}), res1),
            (MultipartEncoder(fields={'file': ('test.mp3',
                                              open(sound_path, 'rb'),
                                              'audio/mp3')}), res2),
            (MultipartEncoder(fields={'file': ('test.png',
                                              open(img_path, 'rb'),
                                              'image/png'),
                                     'result': json.dumps(TEST_OUTPUT)}), res3),
            (MultipartEncoder(fields={'file': ('test.mp3',
                                              open(sound_path, 'rb'),
                                              'audio/mp3'),
                                     'result': json.dumps(TEST_OUTPUT)}), res4)
            ]


@pytest.mark.parametrize("data, expected", testdata)
def test_home(data, expected):
    result = test_app.post('/bird_detection', data=data,
                           headers={'Content-Type': data.content_type})
    assert result.status_code == 200
    res = json.loads(result.data)['result']
    res = [d['species'] for d in res]
    print(res)
    assert set(res) == set(expected)

