import io

import numpy as np
from PIL import Image
from scipy import misc, signal
import librosa

IMG_SIZE = (299, 299)
RGB_IMG_SIZE = (299, 299, 3)


def preprocess_song(audio, orig_sr, min_duration=10, target_sr=22050):
    y = librosa.core.resample(audio, orig_sr=orig_sr, target_sr=target_sr)
    duration = librosa.core.get_duration(y, sr=target_sr)
    while duration < min_duration:
        y = np.append(y, y)
        duration = librosa.core.get_duration(y)
    return y, target_sr


def apply_ft(audio, sr, win_size=512):
    f, t, spec = signal.spectrogram(audio, fs=sr, nperseg=win_size,
                                    window='hann')
    log_spec = np.log(spec.T.astype(np.float32) + 1e-10)
    resized_spec = misc.imresize(np.abs(log_spec.T), IMG_SIZE)
    return resized_spec


def generate_spec_from_sound(filename):
    rgb = np.zeros(RGB_IMG_SIZE)
    rec, sr = librosa.load(str(filename))
    rec, sr = preprocess_song(rec, sr)
    for i, win_size in enumerate([128, 512, 2048]):
        spec = apply_ft(rec, sr, win_size)
        rgb[..., i] = spec
    return Image.fromarray(rgb.astype('uint8'))


def preprocess_image(file_stream):
    image_data = file_stream.read()
    image = Image.open(io.BytesIO(image_data))
    image.thumbnail(IMG_SIZE)
    return image
