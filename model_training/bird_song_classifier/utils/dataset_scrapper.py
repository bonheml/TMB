import time
import requests
import pathlib
import pandas as pd


def download_song(file_path, song_url, retry=0, max_retry=5):
    r = requests.get(song_url)
    print(r.status_code)
    if r.status_code != 200:
        if max_retry < retry or r.status_code == 404:
            return
        time.sleep(200)
        return download_song(file_path, song_url, retry + 1)
    with open(file_path, 'wb') as f:
        f.write(r.content)


def generate_file_path(bird_id, target_dir='../dataset/sound/'):
    path_dir = pathlib.Path(target_dir)
    filename = "{}.mp3".format(bird_id)
    return str(path_dir / filename)


def get_song(row):
    xc_id = row['occurrenceID'].split("XC")[1]
    song_url = "https://www.xeno-canto.org/{}/download".format(xc_id)
    file_path = generate_file_path(row['gbifID'])
    print("Downloading {} to {}".format(song_url, file_path))
    download_song(file_path, song_url)


def get_all_songs():
    df1 = pd.read_csv('../dataset/xeno_canto_bird_songs.tsv', sep='\t',
                     usecols=['gbifID', 'occurrenceID', 'countryCode'])
    df2 = pd.read_csv('../dataset/european_country.tsv', sep='\t')
    df = pd.merge(df1, df2, how='inner', on=['countryCode'])
    for index, row in df.iterrows():
         get_song(row)
         time.sleep(2)


if __name__ == "__main__":
    get_all_songs()
