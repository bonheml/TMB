import numpy as np
import pathlib
from PIL import Image
from scipy import misc, signal
import concurrent.futures
import librosa

sound_path = '../dataset/sound/'
img_path = '../dataset/spectrograms/'


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
    resized_spec = misc.imresize(np.abs(log_spec.T), (299, 299))
    return resized_spec


def generate_spec_from_sound(filename):
    img_filename = "{}{}.png".format(img_path, filename.stem)
    rgb = np.zeros((299, 299, 3))
    rec, sr = librosa.load(str(filename))
    rec, sr = preprocess_song(rec, sr)
    for i, win_size in enumerate([128, 512, 2048]):
        spec = apply_ft(rec, sr, win_size)
        rgb[..., i] = spec
    img = Image.fromarray(rgb.astype('uint8'))
    img.save(img_filename)


if __name__ == "__main__":
    with concurrent.futures.ProcessPoolExecutor() as executor:
        soundfiles = [f.stem for f in pathlib.Path(sound_path).glob('*.mp3')]
        specfiles = [f.stem for f in pathlib.Path(img_path).glob('*.png')]
        res = list(set(soundfiles) - set(specfiles))
        files = [pathlib.Path("{}{}.mp3".format(sound_path, f)) for f in res]
        executor.map(generate_spec_from_sound, files)
