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

res1 = {'apus apus': 0.03,
        'pica pica': 0.02,
        'coturnix coturnix': 0.02,
        'crex crex': 0.02,
        'corvus corax': 0.02,
        'branta canadensis': 0.02,
        'tyto alba': 0.02,
        'sturnus vulgaris': 0.02,
        'tadorna tadorna': 0.01,
        'riparia riparia': 0.01}

res2 = {'anthus trivialis': 0.08,
        'sitta europaea': 0.08,
        'regulus regulus': 0.06,
        'periparus ater': 0.05,
        'prunella modularis': 0.05,
        'corvus cornix': 0.05,
        'parus major': 0.04,
        'turdus viscivorus': 0.04,
        'luscinia svecica': 0.04,
        'phoenicurus phoenicurus': 0.04}

res3 = {'crex crex': 0.46,
        'corvus corax': 0.36,
        'tadorna tadorna': 0.07,
        'riparia riparia': 0.06}

res4 = {'anthus trivialis': 0.44}

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
    res = {d['species']: round(d['score'], 2) for d in res}
    print(res)
    assert res == expected

