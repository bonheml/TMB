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

res1 = [{'species': 'apus apus', 'score': 0.03},
        {'species': 'pica pica', 'score': 0.02},
        {'species': 'coturnix coturnix', 'score': 0.02},
        {'species': 'crex crex', 'score': 0.02},
        {'species': 'corvus corax', 'score': 0.02},
        {'species': 'branta canadensis', 'score': 0.02},
        {'species': 'tyto alba', 'score': 0.02},
        {'species': 'sturnus vulgaris', 'score': 0.02},
        {'species': 'tadorna tadorna', 'score': 0.01},
        {'species': 'riparia riparia', 'score': 0.01}]

res2 = [{'species': 'anthus trivialis', 'score': 0.08},
        {'species': 'sitta europaea', 'score': 0.08},
        {'species': 'regulus regulus', 'score': 0.06},
        {'species': 'periparus ater', 'score': 0.05},
        {'species': 'prunella modularis', 'score': 0.05},
        {'species': 'corvus cornix', 'score': 0.05},
        {'species': 'parus major', 'score': 0.04},
        {'species': 'turdus viscivorus', 'score': 0.04},
        {'species': 'luscinia svecica', 'score': 0.04},
        {'species': 'phoenicurus phoenicurus', 'score': 0.04}]

res3 = [{'species': 'crex crex', 'score': 0.46},
        {'species': 'corvus corax', 'score': 0.36},
        {'species': 'tadorna tadorna', 'score': 0.07},
        {'species': 'riparia riparia', 'score': 0.06}]

res4 = [{'species': 'anthus trivialis', 'score': 0.44}]

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
    res = [{'species': d['species'], 'score': round(d['score'], 2)} for d in res]
    assert res == expected

